import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { user_register } from "../../constants/routes";
import axios from "axios";

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [registerUser, setRegisterUser] = useState();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = async (data) => {
    console.log(data);
    // Use FormData to handle file upload
    const formData = new FormData();
    formData.append("avatar", data.avatar[0]); // assuming avatar is a file input
    formData.append("coverImage", data.coverImage[0]); // assuming avatar is a file input

    // Append other form data to formData
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    setRegisterUser(formData);
  };

  useEffect(() => {
    if (registerUser) {
      axios
        .post(user_register, registerUser, {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for FormData
          },
        })
        .then((res) => {
          navigate("/login");
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          setError("User Already Exist!");
        });
    }
  }, [registerUser]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 lg:p-16 h-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleChange)}
            >
              <div className="mb-5">
                <label
                  htmlFor="avatar"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select Avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  {...register("avatar", { required: "avatar required" })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.avatar && (
                  <p className=" text-red-600 ml-2 italic font-montserrat">
                    {errors.avatar.message}
                  </p>
                )}
              </div>
              <div className="mb-5">
                <label
                  htmlFor="coverImage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select coverImage
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  {...register("coverImage", {
                    required: "cover image required",
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.coverImage && (
                  <p className=" text-red-600 ml-2 italic font-montserrat">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  fullname
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  {...register("fullName", {
                    required: "please enter valid name",
                  })}
                />
                {errors.fullName && (
                  <p className=" text-red-600 ml-2 italic font-montserrat">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  username
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  placeholder="xyz"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("username", { required: "invalid username" })}
                />
                {errors.username && (
                  <p className=" text-red-600 ml-2 italic font-montserrat">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  {...register("email", {
                    required: "invalid email address",
                    validate: {
                      matchPatern: (val) =>
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          val
                        ) || "please enter valid email",
                    },
                  })}
                />
                {errors.email && (
                  <p className=" text-red-600 ml-2 italic font-montserrat">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    validate: (value) =>
                      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value) ||
                      "Password must contain at least one letter and one number",
                  })}
                />
                {errors.password && (
                  <p className=" text-red-600 ml-2 italic font-montserrat">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-blue-600"
              >
                {registerUser && !error ? (
                  <div className=" flex justify-center items-center">
                    <div className="w-8 h-8 rounded-full animate-spin border-4 border-solid border-green-500 border-t-transparent"></div>
                  </div>
                ) : (
                  "Create an account"
                )}
              </button>
              {error && (
                <p className="text-red-600 ml-2 italic font-montserrat font-bold">
                  {error}
                </p>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
