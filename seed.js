import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Recipe from "./models/Recipe.js";

const RECIPES = [
  {
    title: "Creamy Garlic Butter Pasta",
    description: "A rich and indulgent pasta dish with roasted garlic, butter, parmesan, and fresh herbs. Ready in 20 minutes.",
    category: "dinner",
    difficulty: "beginner",
    cookingTime: 20,
    servings: 4,
    coverImage: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800&auto=format&fit=crop",
    tags: ["italian", "pasta", "quick", "vegetarian"],
    ingredients: [
      { name: "Spaghetti", quantity: "400", unit: "g" },
      { name: "Butter", quantity: "4", unit: "tbsp" },
      { name: "Garlic", quantity: "6", unit: "cloves" },
      { name: "Parmesan cheese", quantity: "100", unit: "g" },
      { name: "Heavy cream", quantity: "150", unit: "ml" },
      { name: "Fresh parsley", quantity: "2", unit: "tbsp" },
      { name: "Salt & pepper", quantity: "to taste", unit: "" }
    ],
    instructions: [
      { stepNumber: 1, description: "Boil a large pot of salted water and cook spaghetti until al dente. Reserve 1 cup of pasta water before draining." },
      { stepNumber: 2, description: "Mince the garlic finely. In a large pan, melt butter over medium heat and sauté garlic for 2 minutes until fragrant." },
      { stepNumber: 3, description: "Add heavy cream and stir. Simmer for 3 minutes on low heat." },
      { stepNumber: 4, description: "Add drained pasta to the pan and toss. Add pasta water gradually to loosen the sauce." },
      { stepNumber: 5, description: "Remove from heat, mix in parmesan and parsley. Season with salt and pepper. Serve immediately." }
    ]
  },
  {
    title: "Avocado Toast with Poached Eggs",
    description: "Creamy smashed avocado on sourdough toast topped with perfectly poached eggs, chilli flakes, and lemon.",
    category: "breakfast",
    difficulty: "intermediate",
    cookingTime: 15,
    servings: 2,
    coverImage: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=800&auto=format&fit=crop",
    tags: ["healthy", "eggs", "avocado", "brunch"],
    ingredients: [
      { name: "Sourdough bread", quantity: "2", unit: "slices" },
      { name: "Ripe avocados", quantity: "2", unit: "" },
      { name: "Eggs", quantity: "2", unit: "" },
      { name: "Lemon juice", quantity: "1", unit: "tbsp" },
      { name: "Chilli flakes", quantity: "1/2", unit: "tsp" },
      { name: "Salt & pepper", quantity: "to taste", unit: "" },
      { name: "White vinegar", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Toast sourdough slices until golden and crispy." },
      { stepNumber: 2, description: "Halve avocados, remove pit, and scoop into a bowl. Add lemon juice, salt, and pepper. Smash with a fork until creamy but chunky." },
      { stepNumber: 3, description: "Bring a pot of water to a gentle simmer. Add white vinegar. Create a gentle swirl and carefully crack an egg into the center. Poach for 3 minutes." },
      { stepNumber: 4, description: "Spread smashed avocado generously on toast. Top with poached egg, chilli flakes, and a pinch of salt." }
    ]
  },
  {
    title: "Classic Chicken Tikka Masala",
    description: "Tender chicken marinated in yogurt and spices, grilled and simmered in a rich, smoky tomato-cream sauce.",
    category: "dinner",
    difficulty: "intermediate",
    cookingTime: 50,
    servings: 4,
    coverImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop",
    tags: ["indian", "chicken", "curry", "spicy"],
    ingredients: [
      { name: "Chicken breast", quantity: "700", unit: "g" },
      { name: "Plain yogurt", quantity: "200", unit: "g" },
      { name: "Garam masala", quantity: "2", unit: "tsp" },
      { name: "Tomato puree", quantity: "400", unit: "g" },
      { name: "Heavy cream", quantity: "150", unit: "ml" },
      { name: "Onion", quantity: "2", unit: "" },
      { name: "Garlic & ginger paste", quantity: "2", unit: "tbsp" },
      { name: "Cumin seeds", quantity: "1", unit: "tsp" },
      { name: "Fresh coriander", quantity: "handful", unit: "" }
    ],
    instructions: [
      { stepNumber: 1, description: "Marinate chicken in yogurt, garam masala, and garlic-ginger paste for at least 30 minutes (overnight is best)." },
      { stepNumber: 2, description: "Grill or pan-fry marinated chicken until charred. Set aside." },
      { stepNumber: 3, description: "Fry cumin seeds in oil, add onions and cook until golden. Add garlic-ginger paste and cook 2 minutes." },
      { stepNumber: 4, description: "Add tomato puree and spices. Simmer for 15 minutes until sauce thickens." },
      { stepNumber: 5, description: "Add grilled chicken and cream. Simmer 10 minutes. Garnish with coriander and serve with rice or naan." }
    ]
  },
  {
    title: "Chocolate Lava Cake",
    description: "Individual warm chocolate cakes with a gooey molten centre. Impressively easy and totally decadent.",
    category: "dessert",
    difficulty: "intermediate",
    cookingTime: 25,
    servings: 4,
    coverImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop",
    tags: ["chocolate", "dessert", "baking", "indulgent"],
    ingredients: [
      { name: "Dark chocolate (70%)", quantity: "200", unit: "g" },
      { name: "Butter", quantity: "100", unit: "g" },
      { name: "Eggs", quantity: "4", unit: "" },
      { name: "Caster sugar", quantity: "80", unit: "g" },
      { name: "Plain flour", quantity: "40", unit: "g" },
      { name: "Cocoa powder", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Preheat oven to 200°C. Grease 4 ramekins with butter and dust with cocoa powder." },
      { stepNumber: 2, description: "Melt chocolate and butter together in a heatproof bowl over simmering water. Stir until smooth." },
      { stepNumber: 3, description: "Whisk eggs and sugar until pale and thick. Fold in melted chocolate mixture, then sift in flour." },
      { stepNumber: 4, description: "Divide batter into ramekins. Bake for exactly 12 minutes — edges set, centre still wobbly." },
      { stepNumber: 5, description: "Rest for 1 minute, then invert onto plates. Serve immediately with vanilla ice cream." }
    ]
  },
  {
    title: "Mango Lassi",
    description: "A refreshing Indian yogurt-based drink blended with ripe alphonso mangoes, cardamom and a touch of honey.",
    category: "beverage",
    difficulty: "beginner",
    cookingTime: 5,
    servings: 2,
    coverImage: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&auto=format&fit=crop",
    tags: ["indian", "smoothie", "mango", "healthy", "summer"],
    ingredients: [
      { name: "Ripe mango", quantity: "2", unit: "" },
      { name: "Plain yogurt", quantity: "250", unit: "ml" },
      { name: "Milk", quantity: "100", unit: "ml" },
      { name: "Honey", quantity: "2", unit: "tbsp" },
      { name: "Cardamom powder", quantity: "1/4", unit: "tsp" },
      { name: "Ice cubes", quantity: "handful", unit: "" }
    ],
    instructions: [
      { stepNumber: 1, description: "Peel mangoes and cut the flesh away from the pit. Roughly chop." },
      { stepNumber: 2, description: "Add all ingredients to a blender. Blend on high for 60 seconds until completely smooth." },
      { stepNumber: 3, description: "Taste and adjust sweetness with more honey if needed. Pour into tall glasses over ice. Garnish with a pinch of cardamom." }
    ]
  },
  {
    title: "Greek Salad",
    description: "A crisp, fresh Mediterranean salad with chunky vegetables, Kalamata olives, and generous crumbled feta.",
    category: "lunch",
    difficulty: "beginner",
    cookingTime: 10,
    servings: 4,
    coverImage: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop",
    tags: ["greek", "salad", "vegetarian", "healthy", "mediterranean"],
    ingredients: [
      { name: "Cucumber", quantity: "1", unit: "large" },
      { name: "Tomatoes", quantity: "4", unit: "medium" },
      { name: "Red onion", quantity: "1/2", unit: "" },
      { name: "Kalamata olives", quantity: "100", unit: "g" },
      { name: "Feta cheese", quantity: "200", unit: "g" },
      { name: "Olive oil", quantity: "3", unit: "tbsp" },
      { name: "Dried oregano", quantity: "1", unit: "tsp" },
      { name: "Red wine vinegar", quantity: "1", unit: "tbsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Chop cucumber into large chunks. Quarter the tomatoes. Slice red onion into thin rings." },
      { stepNumber: 2, description: "Combine cucumber, tomatoes, olives, and onion in a large bowl." },
      { stepNumber: 3, description: "Whisk together olive oil, red wine vinegar, and oregano. Season with salt and pepper." },
      { stepNumber: 4, description: "Pour dressing over salad and toss gently. Top with crumbled feta and an extra drizzle of olive oil. Serve immediately." }
    ]
  },
  {
    title: "Crispy Vegetable Spring Rolls",
    description: "Golden, crunchy spring rolls stuffed with stir-fried vegetables, glass noodles, and sesame — perfect as a starter.",
    category: "appetizer",
    difficulty: "intermediate",
    cookingTime: 40,
    servings: 6,
    coverImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop",
    tags: ["asian", "vegetarian", "fried", "snack", "party"],
    ingredients: [
      { name: "Spring roll wrappers", quantity: "12", unit: "" },
      { name: "Cabbage", quantity: "200", unit: "g" },
      { name: "Carrots", quantity: "2", unit: "" },
      { name: "Glass noodles", quantity: "100", unit: "g" },
      { name: "Spring onions", quantity: "4", unit: "" },
      { name: "Soy sauce", quantity: "2", unit: "tbsp" },
      { name: "Sesame oil", quantity: "1", unit: "tsp" },
      { name: "Vegetable oil", quantity: "for frying", unit: "" }
    ],
    instructions: [
      { stepNumber: 1, description: "Soak glass noodles in hot water for 5 minutes. Drain and chop into short pieces." },
      { stepNumber: 2, description: "Shred cabbage, julienne carrots, and slice spring onions. Stir-fry all vegetables with soy sauce and sesame oil for 3 minutes. Cool completely." },
      { stepNumber: 3, description: "Mix cooled vegetables with noodles. Place 2 tablespoons of filling in the lower third of each wrapper. Roll tightly, tucking in the sides. Seal edge with a dab of water." },
      { stepNumber: 4, description: "Heat oil to 180°C. Deep fry rolls in batches for 3-4 minutes until golden and crispy. Drain on paper towels. Serve with sweet chilli sauce." }
    ]
  },
  {
    title: "Banana Oat Pancakes",
    description: "Fluffy, naturally sweetened pancakes made with ripe bananas and oats — no refined sugar, high protein breakfast.",
    category: "breakfast",
    difficulty: "beginner",
    cookingTime: 20,
    servings: 2,
    coverImage: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
    tags: ["healthy", "banana", "oats", "gluten-free-option", "quick"],
    ingredients: [
      { name: "Ripe bananas", quantity: "2", unit: "" },
      { name: "Rolled oats", quantity: "100", unit: "g" },
      { name: "Eggs", quantity: "2", unit: "" },
      { name: "Milk", quantity: "60", unit: "ml" },
      { name: "Baking powder", quantity: "1", unit: "tsp" },
      { name: "Vanilla extract", quantity: "1", unit: "tsp" },
      { name: "Butter", quantity: "for cooking", unit: "" }
    ],
    instructions: [
      { stepNumber: 1, description: "Mash bananas in a bowl until smooth." },
      { stepNumber: 2, description: "Blend oats into a fine flour using a blender or food processor." },
      { stepNumber: 3, description: "Combine mashed banana, oat flour, eggs, milk, baking powder, and vanilla. Mix until smooth. Rest 5 minutes." },
      { stepNumber: 4, description: "Heat butter in a non-stick pan over medium heat. Pour 1/4 cup batter per pancake. Cook until bubbles form (2 min), flip and cook 1 more minute." },
      { stepNumber: 5, description: "Serve stacked with fresh berries, maple syrup, or sliced banana." }
    ]
  },
  {
    title: "Spicy Beef Tacos",
    description: "Juicy seasoned ground beef in warm corn tortillas, topped with fresh pico de gallo, sour cream, and sharp cheddar.",
    category: "dinner",
    difficulty: "beginner",
    cookingTime: 25,
    servings: 4,
    coverImage: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop",
    tags: ["mexican", "beef", "tacos", "spicy", "quick"],
    ingredients: [
      { name: "Ground beef", quantity: "500", unit: "g" },
      { name: "Corn tortillas", quantity: "8", unit: "" },
      { name: "Taco seasoning", quantity: "2", unit: "tbsp" },
      { name: "Tomatoes", quantity: "2", unit: "" },
      { name: "Cheddar cheese", quantity: "100", unit: "g" },
      { name: "Sour cream", quantity: "4", unit: "tbsp" },
      { name: "Lime", quantity: "1", unit: "" },
      { name: "Fresh coriander", quantity: "handful", unit: "" },
      { name: "Red onion", quantity: "1/2", unit: "" }
    ],
    instructions: [
      { stepNumber: 1, description: "Brown ground beef in a pan over high heat, breaking it up. Drain excess fat." },
      { stepNumber: 2, description: "Add taco seasoning and 60ml water. Stir and simmer for 5 minutes until sauce thickens." },
      { stepNumber: 3, description: "Dice tomatoes and red onion finely. Mix with coriander, lime juice, and salt for pico de gallo." },
      { stepNumber: 4, description: "Warm tortillas in a dry pan or directly over a gas flame for 30 seconds each side." },
      { stepNumber: 5, description: "Assemble tacos: spoon beef into tortillas, top with pico de gallo, shredded cheddar, and sour cream. Squeeze lime and serve immediately." }
    ]
  },
  {
    title: "Mushroom Risotto",
    description: "A silky, deeply flavoured Italian risotto made with porcini and mixed wild mushrooms, parmesan, and white wine.",
    category: "dinner",
    difficulty: "advanced",
    cookingTime: 45,
    servings: 4,
    coverImage: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop",
    tags: ["italian", "vegetarian", "mushroom", "comfort food"],
    ingredients: [
      { name: "Arborio rice", quantity: "300", unit: "g" },
      { name: "Mixed mushrooms", quantity: "400", unit: "g" },
      { name: "Dried porcini", quantity: "20", unit: "g" },
      { name: "Vegetable stock", quantity: "1.2", unit: "litres" },
      { name: "White wine", quantity: "150", unit: "ml" },
      { name: "Parmesan", quantity: "80", unit: "g" },
      { name: "Shallots", quantity: "2", unit: "" },
      { name: "Butter", quantity: "3", unit: "tbsp" },
      { name: "Thyme", quantity: "4", unit: "sprigs" }
    ],
    instructions: [
      { stepNumber: 1, description: "Soak dried porcini in 200ml hot water for 15 minutes. Strain, reserving liquid. Add liquid to warm stock." },
      { stepNumber: 2, description: "Sauté shallots in butter until soft. Add sliced mushrooms and thyme. Cook until golden, season well. Set aside." },
      { stepNumber: 3, description: "Toast arborio rice in the same pan for 2 minutes. Add white wine and stir until absorbed." },
      { stepNumber: 4, description: "Add warm stock one ladle at a time, stirring constantly. Wait until each ladle is absorbed before adding the next — about 20 minutes total." },
      { stepNumber: 5, description: "Stir in mushrooms, butter, and grated parmesan. Remove from heat, cover and rest 2 minutes. Serve with extra parmesan and black pepper." }
    ]
  },
  {
    title: "Strawberry Cheesecake",
    description: "A no-bake classic — buttery biscuit base, velvety cream cheese filling, and a gorgeous fresh strawberry topping.",
    category: "dessert",
    difficulty: "intermediate",
    cookingTime: 30,
    servings: 8,
    coverImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop",
    tags: ["dessert", "cheesecake", "strawberry", "no-bake", "party"],
    ingredients: [
      { name: "Digestive biscuits", quantity: "250", unit: "g" },
      { name: "Butter (melted)", quantity: "120", unit: "g" },
      { name: "Cream cheese", quantity: "600", unit: "g" },
      { name: "Icing sugar", quantity: "120", unit: "g" },
      { name: "Double cream", quantity: "300", unit: "ml" },
      { name: "Vanilla extract", quantity: "1", unit: "tsp" },
      { name: "Fresh strawberries", quantity: "400", unit: "g" },
      { name: "Strawberry jam", quantity: "3", unit: "tbsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Crush biscuits finely. Mix with melted butter and press firmly into a lined 23cm springform tin. Chill 30 minutes." },
      { stepNumber: 2, description: "Beat cream cheese and icing sugar until smooth. Add vanilla." },
      { stepNumber: 3, description: "In a separate bowl, whip double cream to soft peaks. Fold gently into cream cheese mixture." },
      { stepNumber: 4, description: "Pour filling over the base, smooth the top. Refrigerate at least 4 hours or overnight." },
      { stepNumber: 5, description: "Warm jam slightly. Halve strawberries and arrange on top. Brush with warm jam for a glossy finish. Serve chilled." }
    ]
  },
  {
    title: "Masala Chai",
    description: "Aromatic Indian spiced tea brewed with ginger, cardamom, cinnamon and cloves, finished with warm milk and jaggery.",
    category: "beverage",
    difficulty: "beginner",
    cookingTime: 10,
    servings: 2,
    coverImage: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop",
    tags: ["indian", "tea", "spiced", "warm", "chai"],
    ingredients: [
      { name: "Water", quantity: "250", unit: "ml" },
      { name: "Whole milk", quantity: "250", unit: "ml" },
      { name: "Assam tea leaves", quantity: "2", unit: "tsp" },
      { name: "Fresh ginger", quantity: "1 inch", unit: "piece" },
      { name: "Cardamom pods", quantity: "4", unit: "" },
      { name: "Cinnamon stick", quantity: "1", unit: "" },
      { name: "Cloves", quantity: "3", unit: "" },
      { name: "Jaggery or sugar", quantity: "2", unit: "tsp" }
    ],
    instructions: [
      { stepNumber: 1, description: "Crush cardamom pods, bruise cinnamon, and grate or crush ginger." },
      { stepNumber: 2, description: "Bring water to boil in a small pan. Add all spices and simmer for 3 minutes to infuse." },
      { stepNumber: 3, description: "Add tea leaves and jaggery. Simmer 1 minute." },
      { stepNumber: 4, description: "Pour in milk and bring to a gentle boil, stirring. Reduce heat and simmer 2 minutes until aromatic and deep golden brown." },
      { stepNumber: 5, description: "Strain through a fine mesh strainer into cups. Serve hot." }
    ]
  }
]

async function seed() {
  await connectDB()

  console.log("🌱 Starting seed...")

  await Recipe.deleteMany({})
  await User.deleteMany({ email: "demo@recipehub.com" })

  const hashedPassword = await bcrypt.hash("demo1234", 12)
  const demoUser = await User.create({
    username: "recipehub_demo",
    email: "demo@recipehub.com",
    password: hashedPassword,
    bio: "Demo chef account with sample recipes",
  })

  console.log(`✅ Demo user created: demo@recipehub.com / demo1234`)

  const recipesWithAuthor = RECIPES.map(r => ({ ...r, author: demoUser._id }))
  await Recipe.insertMany(recipesWithAuthor)

  console.log(`✅ ${RECIPES.length} recipes seeded with real images`)
  console.log("\n📋 Login credentials:")
  console.log("   Email:    demo@recipehub.com")
  console.log("   Password: demo1234")
  console.log("\n🚀 Run the app: npm run dev")

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error("❌ Seed failed:", err.message)
  process.exit(1)
})
