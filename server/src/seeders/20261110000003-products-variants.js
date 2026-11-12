// server/src/seeders/20261110000003-products-variants.js
'use strict';

module.exports = {
  async up(queryInterface) {
    const [[{ count }]] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM products'
    );
    if (Number(count) > 0) return;

    const now = new Date();

    const products = [
      {
        id: 1,
        category_id: 1,
        name: 'CALEM Club Signature Boxy Tee',
        slug: 'calem-club-signature-boxy-tee',
        description:
          'Áo thun dáng Boxy đặc trưng từ chất liệu 100% Cotton 2 chiều 260GSM. Hình in lụa cao cấp kết hợp chi tiết thêu nổi trước ngực, giữ form chuẩn sau nhiều lần giặt.',
        base_price: 420000,
        sale_price: 350000,
        gender: 'unisex',
        rating_avg: 4.9,
        rating_count: 2,
        sold_count: 148,
        is_featured: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        category_id: 2,
        name: 'Acid Washed Heavyweight Zip Hoodie',
        slug: 'acid-washed-heavyweight-zip-hoodie',
        description:
          'Áo khoác Hoodie khóa kéo 2 chiều xử lý wash loang cổ điển trên nền vải nỉ bông 420GSM dày dặn. Thiết kế mũ 2 lớp đứng form và bo gân dệt chắc chắn.',
        base_price: 790000,
        sale_price: 690000,
        gender: 'unisex',
        rating_avg: 4.8,
        rating_count: 1,
        sold_count: 96,
        is_featured: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        category_id: 4,
        name: 'Parachute Baggy Cargo Pants',
        slug: 'parachute-baggy-cargo-pants',
        description:
          'Quần dài túi hộp dáng rộng từ vải Nylon Ripstop trượt nước nhẹ, thoáng khí. Có dây rút điều chỉnh ở gấu quần và cạp chun co giãn linh hoạt.',
        base_price: 680000,
        sale_price: null,
        gender: 'unisex',
        rating_avg: 5.0,
        rating_count: 1,
        sold_count: 112,
        is_featured: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        category_id: 2,
        name: 'CALEM Racing Varsity Bomber Jacket',
        slug: 'calem-racing-varsity-bomber-jacket',
        description:
          'Áo khoác Varsity phối da PU cao cấp và dạ ép dày dặn. Họa tiết thêu xù Chenille nổi bật phong cách đường phố hiện đại.',
        base_price: 1290000,
        sale_price: 1090000,
        gender: 'men',
        rating_avg: 4.7,
        rating_count: 1,
        sold_count: 64,
        is_featured: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        category_id: 1,
        name: 'Studio Ribbed Cropped Baby Tee',
        slug: 'studio-ribbed-cropped-baby-tee',
        description:
          'Áo thun ôm dáng Baby Tee dành riêng cho nữ với chất liệu cotton gân tăm co giãn 4 chiều mềm mịn, tôn dáng và dễ phối cùng quần cạp cao hoặc chân váy.',
        base_price: 340000,
        sale_price: 290000,
        gender: 'women',
        rating_avg: 4.9,
        rating_count: 1,
        sold_count: 130,
        is_featured: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        category_id: 3,
        name: 'Corduroy Relaxed Overshirt',
        slug: 'corduroy-relaxed-overshirt',
        description:
          'Áo sơ mi nhung tăm (Corduroy) dáng rộng có thể mặc như áo khoác ngoài nhẹ nhàng. Cúc kim loại khắc logo và túi ngực đôi tiện dụng.',
        base_price: 620000,
        sale_price: null,
        gender: 'men',
        rating_avg: 4.6,
        rating_count: 0,
        sold_count: 52,
        is_featured: false,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 7,
        category_id: 5,
        name: 'Pleated Streetwear Mini Skirt',
        slug: 'pleated-streetwear-mini-skirt',
        description:
          'Chân váy xếp ly bản to kèm quần bảo hộ bên trong, vải kaki chéo giữ nếp ly sắc nét, phù hợp phối cùng hoodie hoặc baby tee.',
        base_price: 490000,
        sale_price: 430000,
        gender: 'women',
        rating_avg: 4.8,
        rating_count: 0,
        sold_count: 77,
        is_featured: true,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 8,
        category_id: 6,
        name: 'Heavy Canvas Utility Tote Bag',
        slug: 'heavy-canvas-utility-tote-bag',
        description:
          'Túi tote vải bố 16oz siêu bền, ngăn đựng laptop 15 inch có đệm chống sốc và móc khóa carabiner kim loại tiện lợi.',
        base_price: 320000,
        sale_price: 270000,
        gender: 'unisex',
        rating_avg: 4.9,
        rating_count: 0,
        sold_count: 185,
        is_featured: false,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert('products', products);

    const variants = [
      // Product 1
      { product_id: 1, sku: 'CLM-TEE01-BLK-M', size: 'M', color: 'Đen Obsidian', color_hex: '#111111', price: 350000, stock_quantity: 25, created_at: now, updated_at: now },
      { product_id: 1, sku: 'CLM-TEE01-BLK-L', size: 'L', color: 'Đen Obsidian', color_hex: '#111111', price: 350000, stock_quantity: 30, created_at: now, updated_at: now },
      { product_id: 1, sku: 'CLM-TEE01-BLK-XL', size: 'XL', color: 'Đen Obsidian', color_hex: '#111111', price: 350000, stock_quantity: 15, created_at: now, updated_at: now },
      { product_id: 1, sku: 'CLM-TEE01-CRM-M', size: 'M', color: 'Kem Sữa', color_hex: '#F3EFE6', price: 350000, stock_quantity: 20, created_at: now, updated_at: now },
      { product_id: 1, sku: 'CLM-TEE01-CRM-L', size: 'L', color: 'Kem Sữa', color_hex: '#F3EFE6', price: 350000, stock_quantity: 18, created_at: now, updated_at: now },

      // Product 2
      { product_id: 2, sku: 'CLM-HD02-GRY-M', size: 'M', color: 'Xám Wash', color_hex: '#4B5563', price: 690000, stock_quantity: 14, created_at: now, updated_at: now },
      { product_id: 2, sku: 'CLM-HD02-GRY-L', size: 'L', color: 'Xám Wash', color_hex: '#4B5563', price: 690000, stock_quantity: 20, created_at: now, updated_at: now },
      { product_id: 2, sku: 'CLM-HD02-GRY-XL', size: 'XL', color: 'Xám Wash', color_hex: '#4B5563', price: 690000, stock_quantity: 10, created_at: now, updated_at: now },
      { product_id: 2, sku: 'CLM-HD02-BRN-L', size: 'L', color: 'Nâu Espresso', color_hex: '#4A3728', price: 690000, stock_quantity: 12, created_at: now, updated_at: now },

      // Product 3
      { product_id: 3, sku: 'CLM-CRG03-OLV-M', size: 'M', color: 'Xanh Rêu', color_hex: '#3F4E3C', price: 680000, stock_quantity: 22, created_at: now, updated_at: now },
      { product_id: 3, sku: 'CLM-CRG03-OLV-L', size: 'L', color: 'Xanh Rêu', color_hex: '#3F4E3C', price: 680000, stock_quantity: 18, created_at: now, updated_at: now },
      { product_id: 3, sku: 'CLM-CRG03-BLK-M', size: 'M', color: 'Đen Tuyền', color_hex: '#141414', price: 680000, stock_quantity: 25, created_at: now, updated_at: now },
      { product_id: 3, sku: 'CLM-CRG03-BLK-L', size: 'L', color: 'Đen Tuyền', color_hex: '#141414', price: 680000, stock_quantity: 16, created_at: now, updated_at: now },

      // Product 4
      { product_id: 4, sku: 'CLM-VST04-NVY-L', size: 'L', color: 'Xanh Navy', color_hex: '#1E293B', price: 1090000, stock_quantity: 10, created_at: now, updated_at: now },
      { product_id: 4, sku: 'CLM-VST04-NVY-XL', size: 'XL', color: 'Xanh Navy', color_hex: '#1E293B', price: 1090000, stock_quantity: 8, created_at: now, updated_at: now },
      { product_id: 4, sku: 'CLM-VST04-BLK-M', size: 'M', color: 'Đen Biker', color_hex: '#09090B', price: 1090000, stock_quantity: 12, created_at: now, updated_at: now },

      // Product 5
      { product_id: 5, sku: 'CLM-BBY05-WHT-S', size: 'S', color: 'Trắng Sứ', color_hex: '#FAFAFA', price: 290000, stock_quantity: 30, created_at: now, updated_at: now },
      { product_id: 5, sku: 'CLM-BBY05-WHT-M', size: 'M', color: 'Trắng Sứ', color_hex: '#FAFAFA', price: 290000, stock_quantity: 25, created_at: now, updated_at: now },
      { product_id: 5, sku: 'CLM-BBY05-PNK-S', size: 'S', color: 'Hồng Pastel', color_hex: '#F472B6', price: 290000, stock_quantity: 20, created_at: now, updated_at: now },

      // Product 6
      { product_id: 6, sku: 'CLM-OVR06-KAK-M', size: 'M', color: 'Nâu Be', color_hex: '#B08968', price: 620000, stock_quantity: 15, created_at: now, updated_at: now },
      { product_id: 6, sku: 'CLM-OVR06-KAK-L', size: 'L', color: 'Nâu Be', color_hex: '#B08968', price: 620000, stock_quantity: 14, created_at: now, updated_at: now },

      // Product 7
      { product_id: 7, sku: 'CLM-SKT07-CHR-S', size: 'S', color: 'Xám Than', color_hex: '#374151', price: 430000, stock_quantity: 18, created_at: now, updated_at: now },
      { product_id: 7, sku: 'CLM-SKT07-CHR-M', size: 'M', color: 'Xám Than', color_hex: '#374151', price: 430000, stock_quantity: 20, created_at: now, updated_at: now },

      // Product 8
      { product_id: 8, sku: 'CLM-TOT08-NAT-OS', size: 'FreeSize', color: 'Canvas Tự Nhiên', color_hex: '#E5DEC9', price: 270000, stock_quantity: 40, created_at: now, updated_at: now },
      { product_id: 8, sku: 'CLM-TOT08-BLK-OS', size: 'FreeSize', color: 'Đen Charcoal', color_hex: '#18181B', price: 270000, stock_quantity: 35, created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert('product_variants', variants);

    const images = [
      // Product 1
      { product_id: 1, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80', color_ref: 'Đen Obsidian', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      { product_id: 1, image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=80', color_ref: 'Kem Sữa', is_thumbnail: false, sort_order: 2, created_at: now, updated_at: now },
      // Product 2
      { product_id: 2, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=80', color_ref: 'Xám Wash', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      { product_id: 2, image_url: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=900&q=80', color_ref: 'Nâu Espresso', is_thumbnail: false, sort_order: 2, created_at: now, updated_at: now },
      // Product 3
      { product_id: 3, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80', color_ref: 'Xanh Rêu', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      { product_id: 3, image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80', color_ref: 'Đen Tuyền', is_thumbnail: false, sort_order: 2, created_at: now, updated_at: now },
      // Product 4
      { product_id: 4, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&q=80', color_ref: 'Xanh Navy', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      { product_id: 4, image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=80', color_ref: 'Đen Biker', is_thumbnail: false, sort_order: 2, created_at: now, updated_at: now },
      // Product 5
      { product_id: 5, image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80', color_ref: 'Trắng Sứ', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      { product_id: 5, image_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80', color_ref: 'Hồng Pastel', is_thumbnail: false, sort_order: 2, created_at: now, updated_at: now },
      // Product 6
      { product_id: 6, image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&q=80', color_ref: 'Nâu Be', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      // Product 7
      { product_id: 7, image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&q=80', color_ref: 'Xám Than', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
      // Product 8
      { product_id: 8, image_url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=900&q=80', color_ref: 'Canvas Tự Nhiên', is_thumbnail: true, sort_order: 1, created_at: now, updated_at: now },
    ];

    await queryInterface.bulkInsert('product_images', images);

    await queryInterface.bulkInsert('coupons', [
      {
        code: 'CALEM10',
        description: 'Giảm 10% tối đa 100.000đ cho đơn từ 300.000đ',
        discount_type: 'percent',
        discount_value: 10,
        min_order_amount: 300000,
        max_discount_amount: 100000,
        usage_limit: 500,
        used_count: 12,
        start_date: new Date('2026-01-01T00:00:00Z'),
        end_date: new Date('2027-12-31T23:59:59Z'),
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        code: 'CHAOBAN50K',
        description: 'Giảm trực tiếp 50.000đ cho thành viên mới (đơn từ 400.000đ)',
        discount_type: 'fixed',
        discount_value: 50000,
        min_order_amount: 400000,
        max_discount_amount: null,
        usage_limit: 200,
        used_count: 5,
        start_date: new Date('2026-01-01T00:00:00Z'),
        end_date: new Date('2027-12-31T23:59:59Z'),
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('banners', [
      {
        title: 'DROP 04 // FUTURE ARCHIVE',
        subtitle: 'Bộ sưu tập Thu Đông 2026 — Boxy Fit & Acid Wash Heavyweight',
        image_url: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=85',
        link_url: '/products',
        sort_order: 1,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        title: 'STREET UTILITY CARGO SERIES',
        subtitle: 'Chất liệu Nylon Ripstop trượt nước, phom dáng rộng phóng khoáng',
        image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=85',
        link_url: '/products?category=quan-dai-cargo',
        sort_order: 2,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('reviews', [
      {
        user_id: 2,
        product_id: 1,
        order_id: null,
        rating: 5,
        comment: 'Vải cotton dày dặn cực kỳ đứng form boxy, mặc rất mát và sang.',
        is_approved: true,
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 2,
        product_id: 2,
        order_id: null,
        rating: 5,
        comment: 'Màu xám wash ngoài đời đẹp hơn ảnh, khóa kéo mượt mà.',
        is_approved: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('banners', null, {});
    await queryInterface.bulkDelete('coupons', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('product_variants', null, {});
    await queryInterface.bulkDelete('products', null, {});
  },
};
