import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as crypto from 'crypto';

dotenv.config({ path: join(__dirname, '../../../../.env') });

const categoriesData = {
  "Career Services": [
    "CV & Applications",
    "Interview Preparation",
    "Career Coaching",
    "Profile Optimization",
    "Job Search Support",
    "Other Career Services (Work-related only)"
  ],
  "Professional Services": [
    "Business, Admin & Support Services",
    "Human Resources Services",
    "Customer Support Services",
    "Virtual Assistance",
    "Office & Administrative Support",
    "Finance & Legal Services",
    "Bookkeeping",
    "Financial Advisory",
    "Tax Support",
    "Payroll Services",
    "Contract Drafting",
    "Legal Advisory",
    "Creative & Communication Services",
    "Graphic Design",
    "Branding",
    "Video Editing",
    "Copywriting",
    "Technical Writing",
    "Editing & Proofreading",
    "Other Professional Services (Work-related only)"
  ],
  "Health & Wellness Services": [
    "Therapy / Counselling",
    "Workplace Wellness",
    "Other Health & Wellness Services (Work-related only)"
  ],
  "Technology & Digital Services": [
    "Web Development",
    "Software Development",
    "UI/UX Design",
    "Data Analysis",
    "Cybersecurity",
    "IT Support",
    "CCTV & Security Installation",
    "Other Technology & Digital Services (Work-related only)"
  ],
  "Workplace & Facility Services": [
    "Cleaning & Maintenance",
    "Facility Management",
    "Office Setup & Installation",
    "Construction & Fittings",
    "Technical Installations",
    "Office Setup & Interior Services",
    "Other Workplace & Facility Services (Work-related only)"
  ],
  "Food & Office Meals": [
    "Office Meals & Catering (Services)",
    "Meals (Bulk Orders Only)",
    "Snacks & Pastries (Bulk Orders Only)",
    "Beverages & Drinks",
    "Tea, Coffee & Drink Supplies",
    "Disposable Plates, Cups & Cutlery",
    "Other Food & Office Meal Listings (Work-related only)"
  ],
  "Courses & Training": [
    "Career Development",
    "Technology & Digital Skills",
    "Business & Finance",
    "Creative Skills",
    "Professional Certifications",
    "HSE / Safety Training",
    "Other Courses & Training"
  ],
  "Digital Resources": [
    "Templates",
    "CV Templates",
    "Business Templates",
    "Design Templates",
    "Documents",
    "Policies",
    "SOPs",
    "Contracts",
    "Guides & E-books",
    "Career guides",
    "Business guides",
    "Industry guides",
    "Toolkits & Packs",
    "HR toolkits",
    "Business startup packs",
    "Marketing kits",
    "Career toolkits",
    "90-Day Plans",
    "Career growth plans",
    "Business launch plans",
    "Skill development plans",
    "Other Digital Resources (Work-related only)"
  ],
  "Office Supplies & Stationery": [
    "Paper, notebooks, notepads",
    "Pens, pencils, markers",
    "Files, folders, binders",
    "Desk tools (staplers, clips, etc.)",
    "Desk organizers",
    "Other Office Supplies & Stationery"
  ],
  "Office Equipment & Machines": [
    "Printers",
    "Scanners",
    "Photocopiers",
    "Shredders",
    "Laminating machines",
    "Binding machines",
    "Projectors",
    "Office telephones",
    "Other Office Equipment & Machines"
  ],
  "IT, Security & Connectivity": [
    "Routers",
    "Networking devices",
    "CCTV systems",
    "Biometric systems",
    "Computer accessories",
    "Other IT, Security & Connectivity"
  ],
  "Office Furniture": [
    "Desks",
    "Chairs",
    "Workstations",
    "Cabinets",
    "Shelves",
    "Other Office Furniture (Work-related only)"
  ],
  "Interior, Décor & Office Setup": [
    "Curtains & blinds",
    "Partition materials",
    "Glass fittings",
    "Wall art",
    "Plants",
    "Aquariums",
    "Other Interior, Décor & Office Setup (Work-related only)"
  ],
  "Lighting & Electrical": [
    "Lights & bulbs",
    "Electrical fittings",
    "Extension boxes",
    "Other Lighting & Electrical (Work-related only)"
  ],
  "Workplace Appliances": [
    "Air conditioners",
    "Fans",
    "Refrigerators",
    "Microwaves",
    "Water dispensers",
    "Coffee machines",
    "Other Workplace Appliances"
  ],
  "Toiletries, Cleaning & Janitorial": [
    "Tissue paper",
    "Hand wash & sanitizers",
    "Cleaning tools & chemicals",
    "Air fresheners",
    "Other Toiletries, Cleaning & Janitorial"
  ],
  "Safety, Medical & Emergency": [
    "First aid kits",
    "Fire extinguishers",
    "PPE (helmets, boots, gloves, etc.)",
    "Other Safety, Medical & Emergency"
  ],
  "Professional Wear & Uniforms": [
    "Corporate wear",
    "Industry uniforms",
    "Safety wear",
    "Other Professional Wear & Uniforms"
  ],
  "Business Security & Storage": [
    "Office safes",
    "Lock boxes",
    "Other Business Security & Storage"
  ],
  "Learning Materials": [
    "Books",
    "Study guides",
    "Training manuals",
    "Other Learning Materials"
  ],
  "Professional Bags & Carriers": [
    "Laptop bags",
    "Briefcases",
    "Backpacks",
    "Other Professional Bags & Carriers"
  ],
  "Starter Kits & Bundles": [
    "Job seeker kits",
    "Office setup kits",
    "Remote work kits",
    "Other Starter Kits & Bundles"
  ],
  "Industrial, Oil & Gas, Drilling & Mud Engineering": [
    "PPE & safety gear",
    "Drilling chemicals",
    "Mud engineering tools",
    "Solids control equipment",
    "Industrial measuring tools",
    "Other"
  ],
  "Other / Uncategorized": [
    "Miscellaneous Services (Work-related only)",
    "Miscellaneous Products (Work/Office-related only)"
  ]
};

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database via pg...');
    await client.connect();

    // Begin transaction
    await client.query('BEGIN');

    // Clear existing categories and subcategories (optional, if you want a clean slate)
    // Be careful, if there are products attached, this will fail due to foreign key constraints
    // If you want to merge, you should insert only missing.
    // Let's do an upsert or ignore instead.

    for (const [categoryName, subcategories] of Object.entries(categoriesData)) {
      // Find or create category
      let categoryRes = await client.query(
        `SELECT id FROM shop_categories WHERE name = $1`,
        [categoryName]
      );
      
      let categoryId;
      if (categoryRes.rowCount === 0) {
        categoryId = crypto.randomUUID();
        await client.query(
          `INSERT INTO shop_categories (id, name, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())`,
          [categoryId, categoryName]
        );
        console.log(`Created category: ${categoryName}`);
      } else {
        categoryId = categoryRes.rows[0].id;
      }

      for (const subName of subcategories) {
        let subRes = await client.query(
          `SELECT id FROM shop_subcategories WHERE name = $1 AND "categoryId" = $2`,
          [subName, categoryId]
        );

        if (subRes.rowCount === 0) {
          const subId = crypto.randomUUID();
          await client.query(
            `INSERT INTO shop_subcategories (id, name, "categoryId", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())`,
            [subId, subName, categoryId]
          );
          console.log(`  Created subcategory: ${subName}`);
        }
      }
    }

    await client.query('COMMIT');
    console.log('Successfully seeded shop categories!');
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
