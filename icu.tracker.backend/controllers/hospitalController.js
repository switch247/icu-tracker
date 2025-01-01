const { prisma } = require('@base/config/prismaconfig');

class HospitalController {
  // Get all hospitals
  async getAllHospitals(req, res) {
    try {
      const hospitals = await prisma.hospital.findMany({
        // filter:{deletedAt:null},
        include: { members: true },
      });
      res.status(200).json({ data: hospitals, count: hospitals.length });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch hospitals.' });
    }
  }

  // Get a hospital by ID
  async getHospitalById(req, res) {
    try {
      const { id } = req.params;
      const hospital = await prisma.hospital.findUnique({
        where: { id },
        include: { members: true, icuHistories: true },
      });
      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found.' });
      }
      res.status(200).json(hospital);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch hospital.' });
    }
  }

  // Create a new hospital
  async createHospital(req, res) {
    try {
      const hospitalData = req.body;
      if (hospitalData.latitude) {
        hospitalData.latitude = parseFloat(hospitalData.latitude);
      }
      if (hospitalData.longitude) {
        hospitalData.longitude = parseFloat(hospitalData.longitude);
      }
      const hospital = await prisma.hospital.create({ data: hospitalData });
      res.status(201).json(hospital);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Failed to create hospital.' });
    }
  }

  // Update a hospital by ID
  async updateHospital(req, res) {
    try {
      const { id } = req.params;
      const hospitalData = req.body;
      if (hospitalData.id) {
        delete hospitalData.id;
      }
      if (hospitalData.latitude) {
        hospitalData.latitude = parseFloat(hospitalData.latitude);
      }
      if (hospitalData.longitude) {
        hospitalData.longitude = parseFloat(hospitalData.longitude);
      }
      for (const key in hospitalData) {
        if (typeof hospitalData[key] === 'object') {
          delete hospitalData[key];
        }
      }
      const updatedHospital = await prisma.hospital.update({
        where: { id },
        data: hospitalData,
      });
      res.status(200).json(updatedHospital);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Failed to update hospital.' });
    }
  }

  // Delete a hospital by ID (soft delete)
  async deleteHospital(req, res) {
    try {
      const { id } = req.params;
      // const deletedHospital = await prisma.hospital.update({
      //   where: { id },
      //   data: { deletedAt: new Date() },
      // });
      // res.status(200).json(deletedHospital);

      const deletedHospital = await prisma.hospital.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'Failed to delete hospital.' });
    }
  }

  // Get hospital history
  async getHospitalHistory(req, res) {
    try {
      const { id } = req.params;
      const IcuHistories = await prisma.icuHistory.findMany({
        where: { hospitalId: id },
      });
      if (!IcuHistories) {
        return res.status(404).json({ error: 'Hospital not found.' });
      }
      res.status(200).json(IcuHistories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch hospital history.' });
    }
  }

  // Update all hospitals with a specific role
  async updateHospitalRoles(req, res) {
    try {
      const { currentRole, newRole } = req.body;
      if (!currentRole || !newRole) {
        return res.status(400).json({ error: 'Current role and new role are required.' });
      }

      const updatedHospitals = await prisma.hospital.updateMany({
        where: { role: currentRole },
        data: { role: newRole },
      });

      res.status(200).json({
        message: 'Hospital roles updated successfully.',
        count: updatedHospitals.count,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update hospital roles.' });
    }
  }
}

module.exports = new HospitalController();
