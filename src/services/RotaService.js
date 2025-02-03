import { supabase } from "./supabaseClient";

// Rota table format
// CREATE TABLE rota (
//     rota_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     rota_name TEXT NOT NULL,
//     rota_description TEXT,
//     creator_id UUID REFERENCES users(id) ON DELETE SET NULL
// );

// Rota Data table format
// CREATE TABLE rota_data (
//     rota_data_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     rota_id UUID REFERENCES rota(rota_id) ON DELETE CASCADE,
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     data JSONB NOT NULL
// );

// Rota CRUD operations
const getRotas = async () => {
  const { data, error } = await supabase.from("rota").select("*");
  if (error) throw new Error(error.message);
  return data;
};

const createRota = async (rotaData) => {
  const { data, error } = await supabase.from("rota").insert([rotaData]);
  if (error) throw new Error(error.message);
  return data;
};

const updateRota = async (rotaId, rotaData) => {
  const { data, error } = await supabase
    .from("rota")
    .update(rotaData)
    .eq("rota_id", rotaId);
  if (error) throw new Error(error.message);
  return data;
};

const deleteRota = async (rotaId) => {
  const { data, error } = await supabase
    .from("rota")
    .delete()
    .eq("rota_id", rotaId);
  if (error) throw new Error(error.message);
  return data;
};

// Rota Data CRUD operations
const getRotaData = async (rotaId) => {
  const { data, error } = await supabase
    .from("rota_data")
    .select("*")
    .eq("rota_id", rotaId);
  if (error) throw new Error(error.message);
  return data;
};

const createRotaData = async (rotaData) => {
  const { data, error } = await supabase.from("rota_data").insert([rotaData]);
  if (error) throw new Error(error.message);
  return data;
};

const updateRotaData = async (rotaDataId, rotaData) => {
  const { data, error } = await supabase
    .from("rota_data")
    .update(rotaData)
    .eq("rota_data_id", rotaDataId);
  if (error) throw new Error(error.message);
  return data;
};

const deleteRotaData = async (rotaDataId) => {
  const { data, error } = await supabase
    .from("rota_data")
    .delete()
    .eq("rota_data_id", rotaDataId);
  if (error) throw new Error(error.message);
  return data;
};

const RotaService = {
  getRotas,
  createRota,
  updateRota,
  deleteRota,
  getRotaData,
  createRotaData,
  updateRotaData,
  deleteRotaData,
};

export default RotaService;
