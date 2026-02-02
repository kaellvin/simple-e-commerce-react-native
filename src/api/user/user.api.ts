import { SignUpRequest } from "@/src/types/user/user";
import { fetchWithErrorHanding } from "@/utils/my-utils";

export const createNewUser = async (id: string, email: string) => {
  let signUpRequest: SignUpRequest = {
    id: id,
    email: email,
  };

  await fetchWithErrorHanding<undefined>(
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/users`,
    {
      method: "POST",
      body: JSON.stringify(signUpRequest),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
