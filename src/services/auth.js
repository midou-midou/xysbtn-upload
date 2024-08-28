import authModel from "../models/auth";

export default async function authService() {
  const uplaoders = await authModel.findAll()
  console.log('data res:', uplaoders);
}