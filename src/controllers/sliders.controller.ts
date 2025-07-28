import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Sliders from "../models/Sliders";

export const createSliders = async (req: AuthRequest, res: Response) => {

    if(String(req.user?.role) !== "admin") {
      return res.status(403).json({ code: 403, message: "Only admin can create sliders" });
    }

    if(!req.file) {
      return res.status(400).json({ code: 400, message: "At least one slider image is required" });
    }

    const slider = `/uploads/sliders/${req.file.filename}`;

    try {
        const sliders = await Sliders.create({
            slider,
        });
    
        res.status(201).json({ code: 201, message: "Sliders created", sliders });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};


//get all sliders
export const getSliders = async (_: Request, res: Response) => {
    try {
        const sliders = await Sliders.find();
        res.status(200).json({ code: 200, message: "Sliders fetched", sliders });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};


//delete sliders
export const deleteSliders = async (req: AuthRequest, res: Response) => {
    if(String(req.user?.role) !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admin can delete sliders" });
    }

    const { id } = req.params;

    try {
        const slider = await Sliders.findByIdAndDelete(id);
        if (!slider) {
            return res.status(404).json({ code: 404, message: "Slider not found" });
        }
        res.status(200).json({ code: 200, message: "Slider deleted", slider });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};


export const updateSlider = async (req: AuthRequest, res: Response) => {
    if(String(req.user?.role) !== "admin") {
        return res.status(403).json({ code: 403, message: "Only admin can update sliders" });
    }

    const { id } = req.params;

    try {
        const slider = await Sliders.findById(id);
        if (!slider) {
            return res.status(404).json({ code: 404, message: "Slider not found" });
        }

        if (req.file) {
            slider.slider = `/uploads/sliders/${req.file.filename}`;
        }

        await slider.save();
        res.status(200).json({ code: 200, message: "Slider updated", slider });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Server error", error: err });
    }
};