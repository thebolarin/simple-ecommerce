import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface CategoryAttrs {
    name: string;
    code: string;
}

interface CategoryDoc extends mongoose.Document {
    name: string;
    code: string;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
    build(attrs: CategoryAttrs): CategoryDoc;
}

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

categorySchema.set('versionKey', 'version');
categorySchema.plugin(updateIfCurrentPlugin);

categorySchema.statics.build = (attrs: CategoryAttrs) => {
    return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>('Category', categorySchema);

export { Category };