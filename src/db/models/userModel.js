import mongoose from "mongoose";

const user = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, "First Name is required"],
    min: [2, "Length should be greater than 1"],
    max: [20, "Length should be less than 21"],
    trim: true,
    validate: {
      validator: function (v) {
        const regex = new RegExp("^[a-zA-Z]+$");
        return regex.test(v);
      },
      message: (props) => `${props.value} is invalid for first name.`,
    },
  },
  lastName: {
    type: String,
    require: [true, "Last Name is required"],
    min: [2, "Length should be greater than 1"],
    max: [20, "Length should be less than 21"],
    trim: true,
    validate: {
      validator: function (v) {
        const regex = new RegExp("^[a-zA-Z]+$");
        return regex.test(v);
      },
      message: (props) => `${props.value} is invalid for last name.`,
    },
  },
  password: {
    type: String,
    requires: [true, "Password is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        const regex = new RegExp("[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+");
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid email address.`,
    },
  },
  phoneNo: {
    type: Number,
    sparse: true,
    trim: true,
    validate: {
      validator: function (v) {
        const regex = new RegExp("^[(]?[0-9]{3}[)]?[0-9]{3}[0-9]{4,6}$");
        return regex.test(v);
      },
      message: (props) => `${props.value} is not a valid Phone Number`,
    },
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    default: function () {
      const randomNumber = Math.round(
        Math.random() * 1000 + Date.now().toString().substring(10, 13)
      );
      return `${this.firstName}.${this.lastName}.${randomNumber}`;
    },
  },
  loggedInStatus: {
    type: Boolean,
  },
});

const User = mongoose.model("User", user);

export default User;
