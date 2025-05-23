import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const checkIfUserIsStaff = async (user) => {
  if (!user) return false;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() && docSnap.data().role === "staff";
};
