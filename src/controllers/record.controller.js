import recordService from "../services/record.service.js";

const createRecord = async (req, res) => {
    try {
        const result = await recordService.create(req.body, req.user.id);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getRecords = async (req, res) => {
  try {
    const filters = req.query;
    const result = await recordService.getAll(filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const result = await recordService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const result = await recordService.remove(req.params.id);
    res.json({ message: "Deleted successfully", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
};