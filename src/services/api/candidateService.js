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
    
    // Generate historical LEADS data for trend analysis
    const historicalData = this.generateHistoricalLeadsData(candidate)
    
    return { ...candidate, historicalLeadsData: historicalData }
  }

  generateHistoricalLeadsData(candidate) {
    if (!candidate.leadsScores) return []
    
    const currentDate = new Date()
    const historicalData = []
    
    // Generate 12 months of historical data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate)
      date.setMonth(date.getMonth() - i)
      
      const scores = {}
      Object.entries(candidate.leadsScores).forEach(([domain, score]) => {
        const currentScore = parseInt(score.behavioralLevel) || 0
        // Create realistic progression - start lower and gradually improve
        const progressFactor = (12 - i) / 12
        const baseScore = Math.max(1, currentScore - 2) // Start 2 points lower, minimum 1
        const targetScore = currentScore
        const currentProgressScore = baseScore + (targetScore - baseScore) * progressFactor
        
        // Add some natural variation
        const variation = (Math.random() - 0.5) * 0.3
        scores[domain] = Math.min(5, Math.max(1, currentProgressScore + variation))
      })
      
      historicalData.push({
        date: date.toISOString(),
        scores
      })
    }
    
    return historicalData
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