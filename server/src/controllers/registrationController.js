import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const existing = await Registration.findOne({ user: req.user.id, event: eventId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You are already registered for this event" });
    }

    const registration = await Registration.create({
      user: req.user.id,
      event: eventId,
    });

    res.status(201).json({ success: true, message: "Registered successfully", data: registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndDelete({
      user: req.user.id,
      event: req.params.eventId,
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    res.status(200).json({ success: true, message: "Registration cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate("event", "title date venue category")
      .sort({ registeredAt: -1 });

    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("user", "name email")
      .populate("event", "title date venue category")
      .sort({ registeredAt: -1 });

    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "name email")
      .sort({ registeredAt: -1 });

    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.registrationId,
      { attendanceStatus: req.body.attendanceStatus },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }

    res.status(200).json({ success: true, message: "Attendance updated", data: registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
