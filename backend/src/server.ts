import app from "app";
import "./config/db";
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } else {
    console.log(`🚀 Server is running in production mode`);
  }
});
