import React, { useState } from "react";
import { UserDetails } from "../../interfaces/interfaces";
import mainService from "../../services/service";

interface UserFormProps {
  userDetails: UserDetails;
  setUserDetails: (data: UserDetails) => void;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  userDetails,
  setUserDetails,
  onClose,
}) => {
  const [userDetailsHelper, setUserDetailsHelper] =
    useState<UserDetails>(userDetails);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserDetailsHelper((prev: any) => ({ ...prev, [name]: value }));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((userDetailsHelper.email === "", userDetailsHelper.username === "")) {
      alert("username and email cant be empty!");
    } else {
      try {
        const data = await mainService.editUserData(userDetailsHelper);
        setUserDetails(data);
        onClose();
      } catch (error) {
        console.error("Failed to update user data", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-[#234164] p-8 rounded-lg space-y-6"
    >
      <h2 className="text-2xl text-white font-extrabold text-center">
        Update Your Information
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="first_name"
            className="block font-semibold text-white mb-1"
          >
            First Name
          </label>
          <input
            type="text"
            placeholder="Set First Name"
            id="first_name"
            name="first_name"
            value={userDetailsHelper.first_name}
            onChange={handleChange}
            className="w-full p-3 border border-zinc-700 rounded-xl text-[#6B7280] bg-white focus:ring-2 focus:ring-[#4DA9D9] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block font-semibold text-white mb-1"
          >
            Last Name
          </label>
          <input
            type="text"
            placeholder="Set Last Name"
            id="last_name"
            name="last_name"
            value={userDetailsHelper.last_name}
            onChange={handleChange}
            className="w-full p-3 border border-zinc-700 rounded-xl text-[#6B7280] bg-white focus:ring-2 focus:ring-[#4DA9D9] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block font-semibold text-white mb-1"
          >
            Username
          </label>
          <input
            type="text"
            placeholder="Set username"
            id="username"
            name="username"
            value={userDetailsHelper.username}
            onChange={handleChange}
            className="w-full p-3 border border-zinc-700 rounded-xl text-[#6B7280] bg-white focus:ring-2 focus:ring-[#4DA9D9] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-semibold text-white mb-1"
          >
            Email
          </label>
          <input
            type="email"
            placeholder="Set email"
            id="email"
            name="email"
            value={userDetailsHelper.email}
            onChange={handleChange}
            className="w-full p-3 border border-zinc-700 rounded-xl text-[#6B7280] bg-white focus:ring-2 focus:ring-[#4DA9D9] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={onClose}
          className="w-36 bg-zinc-400 text-white font-medium py-2 px-4 rounded-xl hover:bg-zinc-600 transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="w-36 bg-[#4DA9D9] text-white font-bold py-2 px-4 rounded-xl hover:bg-[#008ABB] transition-all"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default UserForm;
