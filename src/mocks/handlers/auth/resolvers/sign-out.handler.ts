import { delay, HttpResponse } from "msw";

export const signOut = async () => {
  await delay(1000);
  return HttpResponse.json(
    {
      success: true,
      message: "",
      data: null,
    },
    {
      status: 200,
    }
  );
};
