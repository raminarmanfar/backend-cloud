import { model, Schema } from 'mongoose';
// tslint:disable object-literal-sort-keys
const ContactSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  firstName: { type: String, default: '', required: true },
  lastName: { type: String, default: '', required: true },
  email: { type: String, default: '', required: true },
  subject: { type: String, default: '', required: true }
});

export default model('Contact', ContactSchema);