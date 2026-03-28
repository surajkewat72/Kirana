import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

/**
 * Kirana Database Seeder
 * Reads from Kirana.csv and populates Category and Product tables.
 */
async function main() {
    const csvFilePath = path.resolve(__dirname, '../Kirana.csv');
    const records: any[] = [];
    const categoriesMap = new Map<string, string>(); // Name -> ID

    console.log('🚀 Starting Data Seeding...');

    // 1. Parse CSV into memory (limited for safety)
    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                if (records.length < 1000) { // Limiting to 1000 for initial seed
                    records.push(data);
                }
            })
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`📦 Loaded \${records.length} records from CSV.`);

    // 2. Extract and Seed Unique Categories
    const uniqueCategoryNames = Array.from(new Set(records.map(r => r.category)));
    
    console.log(`📂 Seeding \${uniqueCategoryNames.length} unique categories...`);
    
    for (const name of uniqueCategoryNames) {
        const category = await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name, type: 'General' }
        });
        categoriesMap.set(name, category.id);
    }

    // 3. Batch Seed Products
    console.log('🛒 Seeding products in batches...');
    
    const BATCH_SIZE = 100;
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        
        const productData = batch.map(r => {
            const category = r.category || '';
            let imageUrl = '/images/products/gourmet.png'; // Default

            if (category.includes('Fruits')) imageUrl = '/images/products/fruits.png';
            else if (category.includes('Vegetables')) imageUrl = '/images/products/vegetables.png';
            else if (category.includes('Beauty') || category.includes('Hygiene')) imageUrl = '/images/products/beauty.png';
            else if (category.includes('Snacks')) imageUrl = '/images/products/snacks.png';
            else if (category.includes('Foodgrains')) imageUrl = '/images/products/foodgrains.png';
            else if (category.includes('Cleaning')) imageUrl = '/images/products/cleaning.png';
            else if (category.includes('Bakery')) imageUrl = '/images/products/bakery.png';
            else if (category.includes('Beverages')) imageUrl = '/images/products/beverages.png';

            return {
                name: r.product,
                brand: r.brand,
                categoryId: categoriesMap.get(r.category)!,
                salePrice: parseFloat(r.sale_price) || 0,
                marketPrice: parseFloat(r.market_price) || 0,
                rating: parseFloat(r.rating) || 0,
                description: r.description?.slice(0, 1000),
                imageUrl: imageUrl
            };
        });

        await prisma.product.createMany({
            data: productData,
            skipDuplicates: true
        });

        console.log(`✅ Processed batch \${i / BATCH_SIZE + 1} (\${i + batch.length}/\${records.length})`);
    }

    console.log('✨ Seeding Completed Successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
