const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qssjxxjwtzbukfyibeho.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzc2p4eGp3dHpidWtmeWliZWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMDUyMDgsImV4cCI6MjA5NzU4MTIwOH0.HaZry-0aZxSazKN3XH_cuVJiz5PRYfV0DlWX4p7J1Zw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
    console.log('Checking reservations table:');
    const { data: resData, error: resError } = await supabase.from('reservations').select('*').limit(1);
    console.log(resError || resData);
    
    console.log('Checking Queue Table:');
    const { data: q1Data, error: q1Error } = await supabase.from('Queue Table').select('*').limit(1);
    console.log(q1Error || q1Data);

    console.log('Checking queue_table:');
    const { data: q2Data, error: q2Error } = await supabase.from('queue_table').select('*').limit(1);
    console.log(q2Error || q2Data);
}

checkTables();
