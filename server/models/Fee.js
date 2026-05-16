import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid', 'Pending'],
        default: 'Unpaid'
    },
    dueDate: {
        type: Date,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
