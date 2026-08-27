import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      banner: req.file ? req.file.path : "",
      createdBy: req.user.id,
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getVisibleEventFilter = (includePending = false) => {
  if (includePending) {
    return {};
  }

  return {
    $or: [
      { isApproved: true },
      { isApproved: { $exists: false } },
    ],
  };
};

export const getEvents = async (req, res) => {
  try {
    const includePending = req.query.includePending === "true";
    const filter = getVisibleEventFilter(includePending);

    const events = await Event.find(filter).sort({
      date: 1,
    });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const includePending =
      req.query.includePending === "true";

    const filter =
      getVisibleEventFilter(includePending);

    const event = await Event.findOne({
      _id: req.params.id,
      ...filter,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    if (req.file) {
      req.body.banner = req.file.path;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        isApproved: true,
      },
      {
        new: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event approved successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};