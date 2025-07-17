export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};