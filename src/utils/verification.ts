export default function useVerification() {
  const password = (valueToVerify: string) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/;

    return regex.test(valueToVerify);
  };

  return {
    password,
  };
}
