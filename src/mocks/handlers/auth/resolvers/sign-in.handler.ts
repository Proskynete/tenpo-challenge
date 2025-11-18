import { delay, HttpResponse } from "msw";

export const signIn = async ({ request }: { request: Request }) => {
  const data = await request.json();

  if (data.email !== "leopoldo.henchoz@tenpo.cl") {
    await delay(1500);
    return HttpResponse.json(
      {
        success: false,
        message: "Email or password wrong",
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
      message: "",
      data: {
        token: "fake-jwt-token-for-testing-" + Date.now(),
      },
    },
    {
      status: 200,
    }
  );
};
