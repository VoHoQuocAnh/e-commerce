// server/src/seeders/20261110000002-categories.js
'use strict';

module.exports = {
  async up(queryInterface) {
    const [[{ count }]] = await queryInterface.sequelize.query(
      'SELECT COUNT(*) AS count FROM categories'
    );
    if (Number(count) > 0) return;

    const now = new Date();
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        parent_id: null,
        name: 'Áo Thun / Boxy Tees',
        slug: 'ao-thun-boxy-tees',
        description: 'Áo thun cotton 2 chiều định lượng cao 260GSM, form boxy hiện đại.',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        parent_id: null,
        name: 'Áo Khoác & Hoodie',
        slug: 'ao-khoac-hoodie',
        description: 'Hoodie nỉ chân cua, zip jacket và áo khoác varsity phong cách streetwear.',
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        parent_id: null,
        name: 'Áo Sơ Mi & Polo',
        slug: 'ao-so-mi-polo',
        description: 'Sơ mi relaxed fit, áo polo dệt kim và corduroy overshirt.',
        image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        parent_id: null,
        name: 'Quần Dài & Cargo',
        slug: 'quan-dai-cargo',
        description: 'Quần túi hộp parachute, denim ống rộng và quần tây dáng suông.',
        image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        parent_id: null,
        name: 'Quần Short & Chân Váy',
        slug: 'quan-short-chan-vay',
        description: 'Quần short kaki, short dù thể thao và chân váy streetwear.',
        image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        parent_id: null,
        name: 'Phụ Kiện Studio',
        slug: 'phu-kien-studio',
        description: 'Túi tote canvas, nón lưỡi trai wash và tất cao cổ.',
        image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
