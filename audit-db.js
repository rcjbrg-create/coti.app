const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://facdbydtkqabmxkdcugp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY2RieWR0a3FhYm14a2RjdWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2Nzg1NjYsImV4cCI6MjA5NDI1NDU2Nn0.CisZJQ3JeYdPwHuvsyKpusrQoSIsexJlUEaYTZSGZBw'
);

async function auditDatabase() {
  console.log('=== AUDIT COMPLETO DO BANCO COTI ===\n');

  // 1. Verificar tabelas existentes
  console.log('1. TABELAS EXISTENTES:');
  const tables = ['categories', 'dishes', 'dish_ingredients', 'dish_steps', 'dish_media', 'stations', 'checklists', 'checklist_items', 'checklist_responses', 'users'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`   ❌ ${table}: ${error.message}`);
    } else {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      console.log(`   ✅ ${table}: ${count} registros`);
    }
  }

  // 2. Verificar categorias
  console.log('\n2. CATEGORIAS:');
  const { data: categories } = await supabase.from('categories').select('id, name, parent_id').order('name');
  categories?.forEach(c => {
    const type = c.parent_id ? '  [sub]' : '[main]';
    console.log(`   ${type} ${c.name}`);
  });

  // 3. Verificar pratos
  console.log('\n3. PRATOS:');
  const { data: dishes } = await supabase.from('dishes').select('id, name, category_id, hero_image_path').order('name');
  console.log(`   Total: ${dishes?.length || 0}`);
  const withImage = dishes?.filter(d => d.hero_image_path).length || 0;
  console.log(`   Com imagem: ${withImage}`);

  // 4. Verificar checklists
  console.log('\n4. CHECKLISTS:');
  const { data: checklists } = await supabase.from('checklists').select('id, name, sector, frequency').order('name');
  checklists?.forEach(c => {
    console.log(`   [${c.sector}] ${c.name} (${c.frequency})`);
  });

  // 5. Verificar estações
  console.log('\n5. ESTAÇÕES:');
  const { data: stations } = await supabase.from('stations').select('id, name');
  stations?.forEach(s => console.log(`   ${s.name}`));

  // 6. Verificar drinks
  console.log('\n6. DRINKS:');
  const { data: drinks } = await supabase.from('dishes').select('id, name').eq('category_id', 'e0389afc-72fd-4546-9934-2f06f6567504');
  console.log(`   Total: ${drinks?.length || 0}`);

  console.log('\n=== FIM DO AUDIT ===');
}

auditDatabase().catch(console.error);
