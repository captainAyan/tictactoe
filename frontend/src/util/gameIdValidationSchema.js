import * as Yup from "yup";

export const GameIdSchema = Yup.object().shape({
  gameId: Yup.string().label("Game Id").min(36).max(36).required(),
});
