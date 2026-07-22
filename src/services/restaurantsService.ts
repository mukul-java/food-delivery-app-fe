import type { Restaurant, FoodItem } from "@/types/restaurant";

const CUISINES = [
  { name: "Bella Napoli", desc: "Authentic wood-fired Italian pizza & pasta." },
  { name: "Sakura Sushi", desc: "Fresh nigiri, sashimi & signature rolls." },
  { name: "Taco Fiesta", desc: "Street-style Mexican tacos and burritos." },
  { name: "Spice Route", desc: "North Indian curries, biryani & tandoor." },
  { name: "Green Bowl", desc: "Healthy salads, grain bowls & smoothies." },
  { name: "Burger Yard", desc: "Smash burgers, loaded fries & shakes." },
];

const MENU: Record<string, Omit<FoodItem, "id" | "restaurantId">[]> = {
  "Bella Napoli": [
    { name: "Margherita Pizza", description: "Tomato, mozzarella, fresh basil.", price: 12.5, quantity: 20 },
    { name: "Pepperoni Pizza", description: "Spicy pepperoni & mozzarella.", price: 14.0, quantity: 20 },
    { name: "Spaghetti Carbonara", description: "Egg, pancetta, pecorino, pepper.", price: 13.5, quantity: 15 },
    { name: "Tiramisu", description: "Coffee-soaked ladyfingers, mascarpone.", price: 6.5, quantity: 10 },
  ],
  "Sakura Sushi": [
    { name: "California Roll", description: "Crab, avocado, cucumber.", price: 9.0, quantity: 25 },
    { name: "Salmon Nigiri (6 pc)", description: "Fresh Atlantic salmon.", price: 11.0, quantity: 20 },
    { name: "Spicy Tuna Roll", description: "Tuna, sriracha, sesame.", price: 10.5, quantity: 18 },
    { name: "Miso Soup", description: "Tofu, wakame, scallions.", price: 3.5, quantity: 30 },
  ],
  "Taco Fiesta": [
    { name: "Al Pastor Tacos (3)", description: "Marinated pork, pineapple, cilantro.", price: 8.5, quantity: 30 },
    { name: "Chicken Burrito", description: "Rice, beans, salsa, cheese.", price: 9.5, quantity: 25 },
    { name: "Loaded Nachos", description: "Cheese, jalapeños, guac, sour cream.", price: 7.5, quantity: 20 },
    { name: "Churros", description: "Cinnamon sugar, chocolate dip.", price: 5.0, quantity: 15 },
  ],
  "Spice Route": [
    { name: "Butter Chicken", description: "Creamy tomato curry with naan.", price: 13.0, quantity: 20 },
    { name: "Paneer Tikka Masala", description: "Grilled paneer in spiced gravy.", price: 12.0, quantity: 18 },
    { name: "Chicken Biryani", description: "Basmati, saffron, raita.", price: 12.5, quantity: 22 },
    { name: "Garlic Naan", description: "Fresh from the tandoor.", price: 3.0, quantity: 40 },
  ],
  "Green Bowl": [
    { name: "Chicken Caesar", description: "Romaine, parmesan, croutons.", price: 10.5, quantity: 20 },
    { name: "Quinoa Power Bowl", description: "Quinoa, chickpeas, avocado, tahini.", price: 11.5, quantity: 18 },
    { name: "Berry Smoothie", description: "Strawberry, blueberry, banana.", price: 6.0, quantity: 25 },
    { name: "Avocado Toast", description: "Sourdough, chili flakes, egg.", price: 8.0, quantity: 15 },
  ],
  "Burger Yard": [
    { name: "Classic Smash", description: "Beef, cheese, pickles, house sauce.", price: 9.5, quantity: 25 },
    { name: "Bacon BBQ Burger", description: "Bacon, cheddar, crispy onions.", price: 11.0, quantity: 22 },
    { name: "Loaded Fries", description: "Cheese sauce, bacon, scallions.", price: 6.5, quantity: 30 },
    { name: "Vanilla Milkshake", description: "Thick, hand-scooped.", price: 5.5, quantity: 20 },
  ],
};

const CITIES = [
  { city: "Springfield", state: "CA", zipcode: 90001 },
  { city: "Riverdale", state: "NY", zipcode: 10462 },
  { city: "Fairview", state: "TX", zipcode: 75069 },
  { city: "Lakewood", state: "CO", zipcode: 80226 },
  { city: "Brookside", state: "IL", zipcode: 60601 },
  { city: "Hillcrest", state: "WA", zipcode: 98101 },
];

const MOCK_RESTAURANTS: Restaurant[] = CUISINES.map((c, i) => {
  const id = `rest-${i + 1}`;
  const items: FoodItem[] = MENU[c.name].map((it, j) => ({
    ...it,
    id: `${id}-food-${j + 1}`,
    restaurantId: id,
  }));
  const loc = CITIES[i % CITIES.length];
  return {
    id,
    name: c.name,
    description: c.desc,
    address: {
      address: `${100 + i * 15} Market St`,
      city: loc.city,
      state: loc.state,
      zipcode: loc.zipcode,
    },
    contactInfo: [9000000000 + i * 111111],
    foodItems: items,
    rating: Number((4 + ((i * 13) % 10) / 10).toFixed(1)),
    owner: { name: `Owner ${i + 1}` },
  };
});

export const restaurantsService = {
  async list(params: { search?: string } = {}): Promise<Restaurant[]> {
    await new Promise((r) => setTimeout(r, 250));
    const s = (params.search ?? "").toLowerCase().trim();
    if (!s) return MOCK_RESTAURANTS;
    return MOCK_RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.description.toLowerCase().includes(s) ||
        r.address.city.toLowerCase().includes(s),
    );
  },

  async get(id: string): Promise<Restaurant | undefined> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_RESTAURANTS.find((r) => r.id === id);
  },
};
