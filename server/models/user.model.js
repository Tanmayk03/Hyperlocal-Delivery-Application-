import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide Name"]
    },
    email: {
        type: String,
        required: [true, "Provide Email"],
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Provide Password"],
        select: false
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refreshToken: {
        type: String,
        default: ""
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    last_login_date: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [{
        type: mongoose.Schema.ObjectId,
        ref: 'address'
    }],
    shopping: [{
        type: mongoose.Schema.ObjectId,
        ref: 'cartProduct'
    }],
    order_history: [{
        type: mongoose.Schema.ObjectId,
        ref: 'order'
    }],
    forgot_password_otp: { 
        type: String,
        default: null
    },
    forgot_password_expiry: {
        type: Date,
        default: null // ✅ fixed
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
}, {
    timestamps: true
});

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
