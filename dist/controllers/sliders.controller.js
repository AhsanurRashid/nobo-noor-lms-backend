"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSlider = exports.deleteSliders = exports.getSliders = exports.createSliders = void 0;
const Sliders_1 = __importDefault(require("../models/Sliders"));
const createSliders = async (req, res) => {
    if (String(req.user?.role) !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admin can create sliders" });
    }
    if (!req.file) {
        return res.status(400).json({ code: 400, message: "At least one slider image is required" });
    }
    const slider = `/uploads/sliders/${req.file.filename}`;
    try {
        const sliders = await Sliders_1.default.create({
            slider,
        });
        res.status(201).json({ code: 201, message: "Sliders created", sliders });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.createSliders = createSliders;
//get all sliders
const getSliders = async (_, res) => {
    try {
        const sliders = await Sliders_1.default.find();
        res.status(200).json({ code: 200, message: "Sliders fetched", sliders });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.getSliders = getSliders;
//delete sliders
const deleteSliders = async (req, res) => {
    if (String(req.user?.role) !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admin can delete sliders" });
    }
    const { id } = req.params;
    try {
        const slider = await Sliders_1.default.findByIdAndDelete(id);
        if (!slider) {
            return res.status(404).json({ code: 404, message: "Slider not found" });
        }
        res.status(200).json({ code: 200, message: "Slider deleted", slider });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.deleteSliders = deleteSliders;
const updateSlider = async (req, res) => {
    if (String(req.user?.role) !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admin can update sliders" });
    }
    const { id } = req.params;
    try {
        const slider = await Sliders_1.default.findById(id);
        if (!slider) {
            return res.status(404).json({ code: 404, message: "Slider not found" });
        }
        if (req.file) {
            slider.slider = `/uploads/sliders/${req.file.filename}`;
        }
        await slider.save();
        res.status(200).json({ code: 200, message: "Slider updated", slider });
    }
    catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};
exports.updateSlider = updateSlider;
