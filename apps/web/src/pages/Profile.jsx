import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "@cartify/ui";
import { updateProfile, clearProfileError } from "../store/authSlice";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profileLoading, profileError } = useSelector(
    (state) => state.auth,
  );

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [submitted, setSubmitted] = useState(false);

  // don't show a stale server error next time the page is opened
  useEffect(() => {
    return () => {
      dispatch(clearProfileError());
    };
  }, [dispatch]);

  // send only what actually changed
  const changes = {};
  if (name.trim() !== user?.name) changes.name = name.trim();
  if (email.trim() !== user?.email) changes.email = email.trim();
  const hasChanges = Object.keys(changes).length > 0;

  // validate only the fields we're about to send
  const errors = {
    name:
      "name" in changes && changes.name.length < 2
        ? "Name must be at least 2 characters"
        : "",
    email:
      "email" in changes && !EMAIL_PATTERN.test(changes.email)
        ? "Enter a valid email address"
        : "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (errors.name || errors.email || !hasChanges) return;

    const result = await dispatch(updateProfile(changes));
    if (updateProfile.fulfilled.match(result)) setSubmitted(false);
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition ${
      hasError
        ? "border-red-400 focus:ring-red-200"
        : "border-gray-200 focus:ring-[#2874f0]/30 focus:border-[#2874f0]"
    }`;

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6">
      <Container>
        <h1 className="text-2xl font-medium text-gray-800 mb-6">My Profile</h1>

        <div className="bg-white rounded-md shadow-sm p-6 max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="profile-name"
                className="text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass(submitted && errors.name)}
              />
              {submitted && errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="profile-email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass(submitted && errors.email)}
              />
              {submitted && errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <p className="text-xs text-gray-400">
              Account type: <span className="capitalize">{user?.role}</span>
            </p>

            {profileError && (
              <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2.5">
                <p className="text-sm text-red-600">{profileError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading || !hasChanges}
              className="bg-[#fb641b] hover:bg-[#e05a18] disabled:bg-orange-300 text-white font-semibold py-2.5 rounded-md text-sm transition"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
