import app from "app";
import "./config/db";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // process.env
  console.log(`app listening on  http://localhost:${PORT}`);
});
