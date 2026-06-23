import mongoose from "mongoose";
import fs from "fs";

const envContent = fs.readFileSync("./.env", "utf8");
const match = envContent.match(/MONGODB_URI=["']?([^"'\n]+)/);
const MONGODB_URI = match ? match[1] : null;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const OperatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { collection: "operators" }
);

const OperatorModel = mongoose.models.Operator || mongoose.model("Operator", OperatorSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");
  const ops = await OperatorModel.find().lean();
  console.log("Operators in DB:", ops);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
