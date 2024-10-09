const { Material } = require('../models');

async function getAllMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        checkMatl: 0,
        verified: 0,
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching materials:', err); 
    return res.status(500).send({ status: err.message });
  }
}

async function getAllTLMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'tlaser',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getAllLaserMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'laser',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getAllSLMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'slaser',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getAllFLMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'flaser',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getAllSawMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'saw',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getAllShearMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'shear',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function getAllPunchMaterials(req, res) {
  try {
    const materials = await Material.findAll({
      where: {
        area: 'punch',
        completed: 0,
      },
      order: [['programNo', 'ASC']],
    });

    return res.status(200).send({ data: materials });
  } catch (err) {
    console.error('Error fetching TL materials:', err);
    return res.status(500).send({ status: err.message });
  }
}

async function createMaterial(req, res) {
  try {
    const result = await Material.create(req.body);
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateCheck(req, res) {
  const { id } = req.body;

  try {
    const material = await Material.findOne({ where: { id } });

    if (!material) {
      return res.status(404).send({ status: 'Material not found' });
    }

    if (material.checkMatl) {
      return res.status(200).send({ data: material });
    }

    const result = await Material.update(
      {
        checkMatl: 1,
        needMatl: 0,
        onOrder: 0,
        verified: 0,
      },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not updated or no changes made' });
    }

    return res.status(200).send({ data: result });

  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateComplete(req, res) {
  const { id } = req.body;

  try {
    const material = await Material.findOne({ where: { id } });

    if (!material) {
      return res.status(404).send({ status: 'Material not found' });
    }

    const result = await Material.update(
      { completed: 1 },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not updated or no changes made' });
    }

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateNeed(req, res) {
  const { id } = req.body;

  try {
    const material = await Material.findOne({ where: { id } });

    if (!material) {
      return res.status(404).send({ status: 'Material not found' });
    }

    if (material.needMatl) {
      return res.status(200).send({ data: material });
    }

    const result = await Material.update(
      {
        checkMatl: 0,
        needMatl: 1,
        onOrder: 0,
        verified: 0,
      },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not updated or no changes made' });
    }

    return res.status(200).send({ data: result });

  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateOnOrder(req, res) {
  const { id } = req.body;

  try {
    const material = await Material.findOne({ where: { id } });

    if (!material) {
      return res.status(404).send({ status: 'Material not found' });
    }

    if (material.onOrder) {
      return res.status(200).send({ data: material });
    }

    const result = await Material.update(
      {
        checkMatl: 0,
        needMatl: 0,
        onOrder: 1,
        verified: 0,
      },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not updated or no changes made' });
    }

    return res.status(200).send({ data: result });

  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateVerified(req, res) {
  const { id } = req.body;

  try {
    const material = await Material.findOne({ where: { id } });

    if (!material) {
      return res.status(404).send({ status: 'Material not found' });
    }

    if (material.verified) {
      return res.status(200).send({ data: material });
    }

    const result = await Material.update(
      {
        checkMatl: 0,
        needMatl: 0,
        onOrder: 0,
        verified: 1,
      },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not updated or no changes made' });
    }

    return res.status(200).send({ data: result });

  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateMaterial(req, res) {
  const { id, programNo, material, jobNo, machine } = req.body;

  try {
    const result = await Material.update(
      { programNo, material, jobNo, machine },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not found or no changes made' });
    }

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

async function updateMaterialsDate(req, res) {
  const { id, date: expected } = req.body;

  try {
    const result = await Material.update(
      { expected },
      { where: { id } }
    );

    if (result[0] === 0) {
      return res.status(404).send({ status: 'Material not found or no changes made' });
    }

    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ status: err.message });
  }
}

module.exports = {
  getAllMaterials,
  getAllTLMaterials,
  getAllLaserMaterials,
  getAllSLMaterials,
  getAllFLMaterials,
  getAllSawMaterials,
  getAllShearMaterials,
  getAllPunchMaterials,
  createMaterial,
  updateCheck,
  updateComplete,
  updateNeed,
  updateOnOrder,
  updateVerified,
  updateMaterial,
  updateMaterialsDate,
}