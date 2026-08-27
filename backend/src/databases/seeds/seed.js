import { prisma } from "../init.mongodb.js";
import bcrypt from "bcryptjs";

import {
  SYSTEM_ROLES,
  WORKSPACE_ROLES,
  PERMISSIONS,
  SUBSCRIPTION_PLANS,
  CATEGORIES,
  TAGS,
  AMENITIES,
  BRAND_TEMPLATES,
  RESTAURANT_TEMPLATES
} from "./data.js";


// --- Seed Function ---

async function runSeed() {
  console.log("🌱 Bắt đầu quá trình Khởi tạo dữ liệu (Seeding) cho Production...");

  try {
    // 1. Seed System Roles
    console.log("--- 1. Seeding System Roles ---");
    for (const role of SYSTEM_ROLES) {
      await prisma.systemRole.upsert({
        where: { name: role.name },
        update: {},
        create: { name: role.name, description: role.description }
      });
    }

    // 2. Seed Workspace Roles
    console.log("--- 2. Seeding Workspace Roles ---");
    for (const role of WORKSPACE_ROLES) {
      await prisma.workspaceRole.upsert({
        where: { name: role.name },
        update: {},
        create: { name: role.name, description: role.description }
      });
    }

    // 3. Seed Permissions
    console.log("--- 3. Seeding Permissions ---");
    // Prisma requires checking for existing to upsert by unique if applicable, but Permission model does not have @unique on name.
    // Wait, let's check `permissions.prisma` - name is NOT unique. We'll findFirst and create if not exist.
    for (const perm of PERMISSIONS) {
      const existingPerm = await prisma.permission.findFirst({ where: { name: perm.name } });
      if (!existingPerm) {
        await prisma.permission.create({
          data: { name: perm.name, description: perm.description, type: perm.type }
        });
      }
    }

    // 4. Seed Admin User
    console.log("--- 4. Seeding Admin Account ---");
    const adminRole = await prisma.systemRole.findUnique({ where: { name: "Admin" } });
    if (adminRole) {
      const adminEmail = "admin01@example.com";
      const hashedPassword = bcrypt.hashSync("Admin@123", 10);
      
      await prisma.user.upsert({
        where: { email: adminEmail },
        update: { 
          // Do not update password if it already exists so we don't reset their changed password
        },
        create: {
          user_name: "admin01",
          email: adminEmail,
          password: hashedPassword,
          name: "Nguyễn Văn A",
          is_active: "ACTIVE",
          systemRoleId: adminRole.id
        }
      });
    }

    // 5. Seed Subscription Plans
    console.log("--- 5. Seeding Subscription Plans ---");
    for (const plan of SUBSCRIPTION_PLANS) {
      await prisma.subscriptionPlan.upsert({
        where: { name: plan.name },
        update: {
          featuresData: plan.featuresData,
          price: plan.price
        },
        create: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          billingCycle: plan.billingCycle,
          maxRestaurants: plan.maxRestaurants,
          featuresData: plan.featuresData,
          isPublic: plan.isPublic,
          isActive: plan.isActive
        }
      });
    }

    // 6. Seed Category Restaurant
    console.log("--- 6. Seeding Categories ---");
    for (const cat of CATEGORIES) {
      await prisma.category_Restaurant.upsert({
        where: { name: cat.name },
        update: {},
        create: { 
          name: cat.name, 
          bgColor: cat.bgColor, 
          textColor: cat.textColor 
        }
      });
    }

    // 7. Seed Tags
    console.log("--- 7. Seeding Tags ---");
    for (const tag of TAGS) {
      await prisma.tags.upsert({
        where: { slug: tag.slug },
        update: { name: tag.name },
        create: { name: tag.name, slug: tag.slug }
      });
    }

    // 8. Seed Amenities
    console.log("--- 8. Seeding Amenities ---");
    for (const amenity of AMENITIES) {
      await prisma.restaurant_Amenities.upsert({
        where: { name: amenity.name },
        update: {},
        create: { name: amenity.name, icon: amenity.icon }
      });
    }

    // 9. Seed Templates
    console.log("--- 9. Seeding Templates ---");
    for (const tpl of BRAND_TEMPLATES) {
      await prisma.template.upsert({
        where: { code: tpl.code },
        update: { name: tpl.name, type: "BRAND_TEMPLATE" },
        create: {
          code: tpl.code,
          name: tpl.name,
          type: "BRAND_TEMPLATE",
          isActive: true
        }
      });
    }

    for (const tpl of RESTAURANT_TEMPLATES) {
      await prisma.template.upsert({
        where: { code: tpl.code },
        update: { name: tpl.name, type: "RESTAURANT_TEMPLATE" },
        create: {
          code: tpl.code,
          name: tpl.name,
          type: "RESTAURANT_TEMPLATE",
          isActive: true
        }
      });
    }

    console.log("✅ Hoàn thành quá trình Khởi tạo dữ liệu (Seeding) thành công!");
  } catch (error) {
    console.error("❌ Xảy ra lỗi trong quá trình Seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute
runSeed();
