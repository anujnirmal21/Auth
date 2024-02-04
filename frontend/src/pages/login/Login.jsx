import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { login } from "../../constants/routes";
import { Link } from "react-router-dom";
import { RefreshTokenCotext } from "../../context/RefreshToken";
import { useForm } from "react-hook-form";

export default function Login() {
  const [loginSatus, setLoginSatus] = useState(false);
  const [loginInfo, setLoginInfo] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const loginInfo = {
  //   username: "@nuj",
  //   email: "ddasd@gmail.com",
  //   password: "stshk",
  // };

  useEffect(() => {
    if (loginInfo) {
      axios
        .post(login, loginInfo)
        .then((res) => {
          setLoginSatus(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          setError("Invalid credentials!");
        });
    }
  }, [loginInfo]);

  const setUserToken = useContext(RefreshTokenCotext);
  useEffect(() => {
    if (loginSatus) {
      setUserToken.setRefreshToken(loginSatus.data.userAccess);
    }
  }, [loginSatus]);

  const handleChange = async (data) => {
    const user = await data;
    if (data) setLoginInfo(user);
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen">
      {loginSatus ? (
        <div className=" h-full dark:bg-gray-800 dark:border-gray-700">
          <h1 className=" text-4xl text-center bg-slate-200 font-montserrat text-red-500 font-semibold p-10">
            Loged In Successfully
          </h1>
          <div className=" flex justify-center items-center p-10 bg-slate-100 flex-col h-screen">
            {loginSatus ? (
              <div className=" bg-lime-300 p-10 rounded-md">
                <h2 className=" p-8 text-4xl text-amber-600 font-bold">
                  User Status
                </h2>
                <ul className=" flex flex-col items-start text-2xl font-semibold font-montserrat p-10">
                  <li>User : {loginSatus.data.user.fullName}</li>
                  <li>username :{loginSatus.data.user.username}</li>
                  <li>User email : {loginSatus.data.user.email}</li>
                </ul>
                <div className="flex items-center justify-center bg-lime-300">
                  <Link to="/get-user">
                    <button className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white">
                      Go To Profile
                      <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-green-500 border-t-transparent"></div>
            )}
          </div>
        </div>
      ) : (
        <>
          <form
            className="max-w-sm mx-auto pt-48"
            onSubmit={handleSubmit(handleChange)}
          >
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your useename
              </label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="xyz"
                {...register("username", { required: "invalid username" })}
              />
              {errors.username && (
                <p className=" text-red-600 ml-2 italic font-montserrat">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
                {...register("email", { required: "invalid email" })}
              />
              {errors.email && (
                <p className=" text-red-600 ml-2 italic font-montserrat">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                placeholder="******"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("password", { required: "invalid password" })}
              />
              {errors.password && (
                <p className=" text-red-600 ml-2 italic font-montserrat">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {loginInfo && !error ? (
                <div className="w-8 h-8 rounded-full animate-spin border-4 border-solid border-green-500 border-t-transparent"></div>
              ) : (
                "Submit"
              )}
            </button>
            {error && (
              <p className="text-red-600 ml-2 italic font-montserrat font-bold text-center p-10">
                {error}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
