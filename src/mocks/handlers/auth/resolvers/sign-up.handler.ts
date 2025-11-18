import { delay, HttpResponse } from "msw";

export const signUp = async ({ request }: { request: Request }) => {
  const data = await request.json();

  if (data.email === "leopoldo.henchoz@tenpo.cl") {
    await delay(1500);
    return HttpResponse.json(
      {
        success: false,
        message: "Email already registered",
        data: null,
      },
      {
        status: 400,
      }
    );
  }

  await delay(2500);
  return HttpResponse.json(
    {
      success: true,
      message: "User created",
      data: {
        token: "",
      },
    },
    {
      status: 200,
    }
  );
};
