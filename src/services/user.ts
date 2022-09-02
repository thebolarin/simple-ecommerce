import { ObjectId } from 'mongoose';
import { UserPayload, UserQueryPayload } from './../interfaces/user.interface';
import { Password } from '../common/services/password';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { UserToken } from '../models/user-token';

export const getAll = async (queryString: UserQueryPayload) => {
  try {
    let pageOptions = {
      page: queryString.page || 0,
      limit: (queryString.limit ? (queryString.limit > 100 ? 100 : queryString.limit) : 25)
    }

    let query: UserQueryPayload;

    if (queryString.userName && queryString.userName != '') query.userName = queryString.userName;
    if (queryString.email && queryString.email != '') query.email = queryString.email;

    const usersCount = await User.countDocuments(query).exec();

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit * 1)
      .exec();

    return {
      status: "success",
      statusCode: 200,
      message: "Users record fetched successfully.",
      data: {
        users,
        total: usersCount,
        pages: Math.ceil(usersCount / pageOptions.limit),
        page: pageOptions.page,
        limit: pageOptions.limit
      }
    }

  } catch (err) {
    return {
      status: "error",
      statusCode: 500,
      message: "Invalid Request",
      data: err
    }
  }
}

export const createUser = async (payload: UserPayload) => {
  try {
    const { userName, email, password } = payload;

    const existingUser = await User.findOne({ email, userName });

    if (existingUser) {
      return { status: "error", statusCode: 400, message: "User with email/username already exists" };
    }

    const user = User.build({
      userName,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await user.save();

    return {
      status: "success", statusCode: 201, message: "User registered successfully",
      data: user
    }
  } catch (err) {
    return {
      status: "error", statusCode: 500, message: "Invalid Request",
      data: err
    }
  }
}

export const signInUser = async (payload: UserPayload ) => {
  try {
    const { email, password } = payload;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return { status: "error", statusCode: 400, message: "Invalid Login Credentials" }
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
      return { status: "error", statusCode: 400, message: "Invalid Login Credentials" }
    }

    // Generate JWT
    const userJwt = jwt.sign((JSON.parse(JSON.stringify(existingUser))), process.env.JWT_KEY!, {
      expiresIn: "2h"
    });

    const refreshToken = jwt.sign((JSON.parse(JSON.stringify(existingUser))), process.env.JWT_REFRESH_KEY!, {
      expiresIn: "30d"
    });

    const userToken = await UserToken.findOne({ userId: existingUser._id });
    if (userToken) await userToken.remove();

    const user = UserToken.build({ userId: existingUser._id, token: refreshToken });
    await user.save();

    existingUser.lastLoginTime = new Date();
    existingUser.updatedAt = new Date();
    await existingUser.save();

    return {
      status: "success", statusCode: 200, message: "User signed in successfully",
      data: { existingUser, userJwt, refreshToken }
    }
  } catch (err) {
    return { status: "error", statusCode: 500, message: "Invalid Request", data: err }
  }
}

export const getOne = async (userId: string) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return { status: "error", statusCode: 404, message: "User not found" };
    }

    return {
      status: "success", statusCode: 200, message: "User fetched successfully",
      data: user
    };

  } catch (err) {
    return {
      status: "error",
      statusCode: 500,
      message: "Invalid Request",
      data: err
    }
  }
}

export const update = async (userId: string, payload: UserPayload) => {
  const { userName } = payload;
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return { status: "error", statusCode: 400, message: "User not found" };
    }

    user.set({ userName, updatedAt: new Date() });
    await user.save();

    return { status: "success", statusCode: 200, message: "User updated successfully", data: user };
  } catch (err) {
    return { status: "error", statusCode: 500, message: "Invalid Request", data: err }
  }
}

export const remove = async (userId: string) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return { status: "error", statusCode: 400, message: "User not found" };
    }

    await user.remove();

    return { status: "success", statusCode: 200, message: "User deleted successfully" };
  } catch (err) {
    return { status: "error", statusCode: 500, message: "Invalid Request", data: err }
  }
}

export const refreshJWTToken = async (refreshToken: string) => {
  try {
    let userToken = await UserToken.findOne({ token: refreshToken })
    if (!userToken) return { status: "error", statusCode: 400, message: "Invalid refresh token" };

    let decodedToken;

    try {
      decodedToken = await jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    } catch (err) {
      decodedToken = null
    }

    if (!decodedToken) {
      return { status: "error", statusCode: 400, message: "Invalid refresh token" };
    }

    decodedToken = JSON.parse(JSON.stringify(decodedToken))

    const user = await User.findOne({ _id: decodedToken._id });

    const decodedUser = jwt.sign((JSON.parse(JSON.stringify(user))), process.env.JWT_KEY!, {
      expiresIn: "2h"
    });

    return {
      statusCode: 200, data: decodedUser, status: "success",
      message: "Access token created successfully"
    }

  } catch (err) {
    return {
      status: "error", statusCode: 500, message: "Invalid Request",
      data: err
    }
  }
}

export const logout = async (refreshToken: string) => {
  try {
    let userToken = await UserToken.findOne({ token: refreshToken });

    if (!userToken) {
      return { status: "success", statusCode: 200, message: "Logout successfully" };
    }

    await userToken.remove();

    return { status: "success", statusCode: 200, message: "Logout successfully" };

  } catch (err) {
    return { status: "error", statusCode: 500, message: "Invalid Request", data: err }
  }
}