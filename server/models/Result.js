import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    answers: [{
        questionIndex: Number,
        selectedOption: Number,
        isCorrect: Boolean
    }]
}, {
    timestamps: true
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
