import candidatesData from "@/services/mockData/candidates.json"

class CandidateService {
  constructor() {
    this.candidates = [...candidatesData]
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.candidates]
  }

  async getById(id) {
    await this.delay()
    const candidate = this.candidates.find(c => c.Id === id)
    if (!candidate) {
      throw new Error("Candidate not found")
    }
    return { ...candidate }
  }

  async create(candidateData) {
    await this.delay()
    
    const maxId = this.candidates.length > 0 ? Math.max(...this.candidates.map(c => c.Id)) : 0
    const newCandidate = {
      Id: maxId + 1,
      ...candidateData,
      createdAt: new Date().toISOString()
    }
    
    this.candidates.push(newCandidate)
    return { ...newCandidate }
  }

  async update(id, candidateData) {
    await this.delay()
    
    const index = this.candidates.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error("Candidate not found")
    }
    
    this.candidates[index] = {
      ...this.candidates[index],
      ...candidateData,
      Id: id,
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.candidates[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.candidates.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error("Candidate not found")
    }
    
    const deletedCandidate = this.candidates.splice(index, 1)[0]
    return { ...deletedCandidate }
  }

  async search(query) {
    await this.delay()
    
    const lowercaseQuery = query.toLowerCase()
    return this.candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(lowercaseQuery) ||
      candidate.department.toLowerCase().includes(lowercaseQuery) ||
      candidate.portfolio.toLowerCase().includes(lowercaseQuery)
    )
  }

  async getByDepartment(department) {
    await this.delay()
    return this.candidates.filter(candidate => candidate.department === department)
  }

  async getByReadinessRating(rating) {
    await this.delay()
    return this.candidates.filter(candidate => candidate.readinessRating === rating)
  }
}

export const candidateService = new CandidateService()