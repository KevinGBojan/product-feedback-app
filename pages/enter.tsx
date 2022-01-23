import { useState, useEffect, useContext, useCallback } from "react";
import { db, auth, provider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import { UserContext } from "../lib/context";
import debounce from "lodash.debounce";
import Image from "next/image";

const Enter = () => {
  const { user, username } = useContext(UserContext);

  // If user is singed out, show the Sign In Button
  // If user is signed in but doesn't have a username, show the form
  // If user is signed in and has chosen a username, show the Sign Out Button

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

export default Enter;

// Sign In With Google Button

function SignInButton() {
  const SignInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={SignInWithGoogle}
          className="mt-40 flex p-4 text-white bg-pallet-100 rounded-md font-semibold"
        >
          <FaGoogle size="24" className="mr-4" />
          <span>Sign In With Google</span>
        </button>
      </div>
    </section>
  );
}

// Sign Out Btn

export const SignOut = () => {
  signOut(auth);
};

function SignOutButton() {
  return (
    <section>
      <button
        onClick={SignOut}
        className="flex mt-40 p-4 text-white bg-pallet-100 rounded-md"
      >
        <span>Sign Out</span>
      </button>
    </section>
  );
}

// Username Form

function UsernameForm() {
  const { user } = useContext(UserContext);
  const [avatar, setAvatar] = useState(
    `https://avatars.dicebear.com/api/avataaars/${new Date().toISOString()}.svg`
  );

  const [formValue, setFormValue] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Commit both docs together as a batch write.
    const batch = writeBatch(db);
    batch.set(doc(db, "users", `${user?.uid}`), {
      username: formValue,
      avatarURL: avatar,
      displayName: user?.displayName,
    });
    batch.set(doc(db, "usernames", `${formValue}`), { uid: user?.uid });
    await batch.commit();
  };

  const onChange = (e: any) => {
    // force form value typed in to match correct format
    const value = e.target.value.toLowerCase();
    const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (value.length < 3) {
      setFormValue(value);
      setLoading(false);
      setValid(false);
    }

    if (regex.test(value)) {
      setFormValue(value);
      setLoading(true);
      setValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
    setAvatar(
      `https://avatars.dicebear.com/api/avataaars/${new Date().toISOString()}.svg`
    );
  }, [formValue]);

  // It will wait for user to stop typing for 0.5 seconds before running
  // the checkUsername function

  // useCallback is wrapped around because every time React re-renders it
  // creates a new function object which will not be debounced whereas
  // useCallback allows that function to memoized so it can be debounced
  // between state changes

  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const docSnap = await getDoc(doc(db, "usernames", `${username}`));
        setValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    <section className="flex flex-col">
      <Image src={avatar} height="120" width="120" />
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="mt-10 flex flex-col justify-center items-center"
      >
        <label htmlFor="username" className="text-lg mb-2">
          Choose Your Username
        </label>
        <input
          value={formValue}
          onChange={onChange}
          className="text-gray-900 text-md px-3 py-2 rounded-md outline-none"
        />
        <ErrorMessage username={formValue} valid={valid} loading={loading} />
        <button
          type="submit"
          disabled={!valid}
          className="px-4 py-2 bg-pallet-100 font-bold text-white tracking-wider rounded-lg mt-4"
        >
          Let's go!
        </button>
      </form>
    </section>
  );
}

function ErrorMessage({
  username,
  valid,
  loading,
}: {
  username: string;
  valid: boolean;
  loading: boolean;
}) {
  if (username.length >= 3) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (valid) {
      return <p>{username} is available!</p>;
    } else if (username && !valid) {
      return <p>That username is taken!</p>;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
