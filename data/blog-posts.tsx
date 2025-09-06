import type { BlogPost } from "@/types/blog"

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Dog Training Tips for New Pet Parents",
    slug: "top-10-dog-training-tips-new-pet-parents",
    excerpt:
      "Starting your journey as a dog parent? These essential training tips will help you build a strong bond with your furry friend and establish good habits from day one.",
    content: `
      <p>Bringing home a new dog is an exciting experience, but it can also be overwhelming. Training your new furry friend is crucial for both their well-being and your sanity. Here are our top 10 training tips for new pet parents.</p>
      
      <h2>1. Start with Basic Commands</h2>
      <p>Begin with simple commands like "sit," "stay," and "come." These form the foundation of all future training.</p>
      
      <h2>2. Use Positive Reinforcement</h2>
      <p>Reward good behavior with treats, praise, or play. This creates positive associations with training.</p>
      
      <h2>3. Be Consistent</h2>
      <p>Use the same commands and rewards every time. Consistency helps your dog understand what you expect.</p>
      
      <h2>4. Keep Training Sessions Short</h2>
      <p>Dogs have short attention spans. Keep sessions to 5-10 minutes for best results.</p>
      
      <h2>5. Socialize Early</h2>
      <p>Expose your dog to different people, animals, and environments in a controlled way.</p>
    `,
    author: {
      name: "Sarah Johnson",
      avatar: "/blog-author-sarah.png",
      bio: "Certified dog trainer with 10+ years of experience",
    },
    category: "Dog",
    tags: ["training", "puppies", "behavior", "tips"],
    featuredImage: "/blog-dog-training.png",
    publishedAt: "2024-01-15",
    readTime: 8,
    views: 1250,
    likes: 89,
  },
  {
    id: "2",
    title: "Understanding Your Cat's Body Language",
    slug: "understanding-cat-body-language",
    excerpt:
      "Learn to decode what your feline friend is trying to tell you through their body language, from tail positions to ear movements.",
    content: `
      <p>Cats are masters of non-verbal communication. Understanding their body language can help you better care for your feline friend and strengthen your bond.</p>
      
      <h2>Tail Positions</h2>
      <p>A cat's tail is like a mood ring. An upright tail usually indicates happiness, while a puffed tail suggests fear or aggression.</p>
      
      <h2>Ear Movements</h2>
      <p>Forward-facing ears show interest and alertness. Flattened ears against the head indicate fear or aggression.</p>
      
      <h2>Eye Contact</h2>
      <p>Slow blinking is a sign of trust and affection. Direct staring can be perceived as threatening.</p>
    `,
    author: {
      name: "Dr. Emily Chen",
      avatar: "/blog-author-emily.png",
      bio: "Veterinarian specializing in feline behavior",
    },
    category: "Cat",
    tags: ["cats", "behavior", "communication", "body language"],
    featuredImage: "/blog-cat-behavior.png",
    publishedAt: "2024-01-12",
    readTime: 6,
    views: 980,
    likes: 67,
  },
  {
    id: "3",
    title: "Best Interactive Toys for Dogs: 2024 Review",
    slug: "best-interactive-toys-dogs-2024-review",
    excerpt:
      "Keep your dog mentally stimulated and entertained with our top picks for interactive toys. From puzzle feeders to smart toys, we've tested them all.",
    content: `
      <p>Mental stimulation is just as important as physical exercise for dogs. Interactive toys can help prevent boredom and destructive behavior while keeping your dog engaged.</p>
      
      <h2>Top 5 Interactive Dog Toys</h2>
      
      <h3>1. Kong Classic</h3>
      <p>The timeless favorite that can be stuffed with treats. Durable and versatile.</p>
      
      <h3>2. Nina Ottosson Puzzle Feeder</h3>
      <p>Great for slow feeding and mental stimulation during meal times.</p>
      
      <h3>3. Snuffle Mat</h3>
      <p>Encourages natural foraging behavior and slows down eating.</p>
    `,
    author: {
      name: "Mike Rodriguez",
      avatar: "/blog-author-mike.png",
      bio: "Pet product reviewer and dog enthusiast",
    },
    category: "Product Reviews",
    tags: ["toys", "reviews", "mental stimulation", "dogs"],
    featuredImage: "/blog-dog-toys.png",
    publishedAt: "2024-01-10",
    readTime: 12,
    views: 2100,
    likes: 156,
  },
  {
    id: "4",
    title: "How to Support Local Animal Rescue Groups",
    slug: "support-local-animal-rescue-groups",
    excerpt:
      "Discover meaningful ways to help animal rescue organizations in your community, from volunteering to donations and fostering.",
    content: `
      <p>Animal rescue groups work tirelessly to save and rehome pets in need. Here's how you can make a difference in your local community.</p>
      
      <h2>Ways to Help</h2>
      
      <h3>Volunteer Your Time</h3>
      <p>Many rescues need help with walking dogs, socializing cats, and administrative tasks.</p>
      
      <h3>Foster Animals</h3>
      <p>Fostering provides temporary homes for animals while they wait for permanent families.</p>
      
      <h3>Donate Supplies</h3>
      <p>Food, blankets, toys, and cleaning supplies are always needed.</p>
    `,
    author: {
      name: "Lisa Thompson",
      avatar: "/blog-author-lisa.png",
      bio: "Animal rescue volunteer and advocate",
    },
    category: "Rescue Groups",
    tags: ["rescue", "volunteering", "community", "helping"],
    featuredImage: "/blog-rescue-dogs.png",
    publishedAt: "2024-01-08",
    readTime: 7,
    views: 750,
    likes: 92,
  },
  {
    id: "5",
    title: "Essential Pet Care Tips for Winter",
    slug: "essential-pet-care-tips-winter",
    excerpt:
      "Keep your pets safe and comfortable during the cold winter months with these essential care tips and safety guidelines.",
    content: `
      <p>Winter weather can pose unique challenges for pet owners. Here's how to keep your furry friends safe and comfortable during the colder months.</p>
      
      <h2>Indoor Comfort</h2>
      <p>Ensure your pets have warm, dry places to rest away from drafts.</p>
      
      <h2>Outdoor Safety</h2>
      <p>Limit time outside for short-haired breeds and consider protective clothing.</p>
      
      <h2>Paw Care</h2>
      <p>Check paws regularly for ice, salt, and chemical irritants.</p>
    `,
    author: {
      name: "Dr. James Wilson",
      avatar: "/blog-author-james.png",
      bio: "Veterinarian with 15 years of experience",
    },
    category: "Pet Care",
    tags: ["winter", "safety", "health", "care tips"],
    featuredImage: "/blog-winter-pet-care.png",
    publishedAt: "2024-01-05",
    readTime: 9,
    views: 1400,
    likes: 78,
  },
  {
    id: "6",
    title: "The Benefits of Regular Vet Checkups",
    slug: "benefits-regular-vet-checkups",
    excerpt:
      "Learn why regular veterinary visits are crucial for your pet's health and how they can prevent serious health issues.",
    content: `
      <p>Regular veterinary checkups are one of the most important things you can do for your pet's health and longevity.</p>
      
      <h2>Early Detection</h2>
      <p>Many health issues can be caught early during routine exams, when they're easier to treat.</p>
      
      <h2>Preventive Care</h2>
      <p>Vaccinations, parasite prevention, and dental care help prevent serious health problems.</p>
      
      <h2>Health Monitoring</h2>
      <p>Regular visits help establish baseline health metrics for your pet.</p>
    `,
    author: {
      name: "Dr. Maria Garcia",
      avatar: "/blog-author-maria.png",
      bio: "Small animal veterinarian and pet health advocate",
    },
    category: "Health",
    tags: ["health", "veterinary", "prevention", "checkups"],
    featuredImage: "/blog-vet-checkup.png",
    publishedAt: "2024-01-03",
    readTime: 6,
    views: 890,
    likes: 54,
  },
]

export const blogCategories = [
  { name: "All", count: blogPosts.length },
  { name: "Dog", count: blogPosts.filter((post) => post.category === "Dog").length },
  { name: "Cat", count: blogPosts.filter((post) => post.category === "Cat").length },
  { name: "Product Reviews", count: blogPosts.filter((post) => post.category === "Product Reviews").length },
  { name: "Rescue Groups", count: blogPosts.filter((post) => post.category === "Rescue Groups").length },
  { name: "Pet Care", count: blogPosts.filter((post) => post.category === "Pet Care").length },
  { name: "Health", count: blogPosts.filter((post) => post.category === "Health").length },
]
