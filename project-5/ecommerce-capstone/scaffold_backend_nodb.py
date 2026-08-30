import os
base_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(base_dir, 'backend')

files = {
    'server.js': '''import express from \\'express\\';
import dotenv from \\'dotenv\\';
import cors from \\'cors\\';
import productRoutes from \\'./routes/productRoutes.js\\';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(\\'/api/products\\', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(Server running on port ));
''',
    'controllers/productController.js': '''import asyncHandler from \\'express-async-handler\\';
import products from \\'../data/products.js\\';

export const getProducts = asyncHandler(async (req, res) => {
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error(\\'Product not found\\');
  }
});
''',
    'routes/productRoutes.js': '''import express from \\'express\\';
import { getProducts, getProductById } from \\'../controllers/productController.js\\';

const router = express.Router();
router.route(\\'/\\').get(getProducts);
router.route(\\'/:id\\').get(getProductById);

export default router;
''',
}

for rel, cont in files.items():
    with open(os.path.join(backend_dir, rel.replace('/', os.sep)), 'w') as f:
        f.write(cont)
print('Done!')

