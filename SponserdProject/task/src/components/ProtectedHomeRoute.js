import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { auth, db } from "../../firebaseConfig";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { ClipLoader } from "react-spinners";

const ProtectedHomeRoute = (WrappedComponent) => {
  const ComponentWithProtection = (props) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log(user);

        if (user) {
          try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();

              console.log(userData);
              dispatch(
                setUser({
                  userData: { ...userData },
                  userId: userDoc.id,
                })
              );
              setUserData(userData);
            } else {
              toast.error("User not found.");
              auth.signOut();
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
            toast.error("An error occurred.");
          }
        } else {
          console.log("No user authenticated.");
        }

        setLoading(false);
      });

      return () => unsubscribe();
    }, [dispatch]);

    if (loading) {
      return (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50">
          <ClipLoader size={50} color="#000" loading={loading} />
        </div>
      );
    }

    return (
      <WrappedComponent
        {...props}
        isAuthenticated={!!userData}
        userData={userData}
      />
    );
  };

  ComponentWithProtection.displayName = `ProtectedHomeRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithProtection;
};

export default ProtectedHomeRoute;
