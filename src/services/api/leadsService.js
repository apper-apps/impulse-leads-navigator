const leadsFramework = {
  domains: {
    leadSelf: {
      name: "Lead Self",
      description: "Self-awareness, emotional regulation, and personal accountability",
      behaviors: [
        "Demonstrates self-awareness and emotional intelligence",
        "Takes accountability for decisions and outcomes",
        "Manages stress and maintains composure under pressure",
        "Seeks feedback and acts on development opportunities",
        "Models ethical behavior and integrity"
      ]
    },
    engageOthers: {
      name: "Engage Others",
      description: "Building relationships, communication, and influence",
      behaviors: [
        "Builds and maintains effective relationships",
        "Communicates clearly and persuasively",
        "Listens actively and empathetically",
        "Influences and motivates others",
        "Demonstrates cultural competence and inclusion"
      ]
    },
    achieveResults: {
      name: "Achieve Results",
      description: "Goal setting, execution, and performance management",
      behaviors: [
        "Sets clear goals and expectations",
        "Drives execution and delivers results",
        "Makes data-driven decisions",
        "Manages resources effectively",
        "Holds self and others accountable for performance"
      ]
    },
    developCoalitions: {
      name: "Develop Coalitions",
      description: "Stakeholder engagement and partnership building",
      behaviors: [
        "Identifies and engages key stakeholders",
        "Builds strategic partnerships and alliances",
        "Navigates complex political environments",
        "Negotiates win-win solutions",
        "Represents organization effectively externally"
      ]
    },
    systemsTransformation: {
      name: "Systems Transformation",
      description: "Change leadership and organizational development",
      behaviors: [
        "Thinks systemically about organizational challenges",
        "Leads change and transformation initiatives",
        "Anticipates and adapts to environmental changes",
        "Develops organizational capabilities",
        "Creates sustainable improvements"
      ]
    }
  },
  
  scoringLevels: {
    1: { name: "Foundational", description: "Basic understanding and occasional demonstration" },
    2: { name: "Developing", description: "Growing competence with some consistency" },
    3: { name: "Proficient", description: "Consistent demonstration of competence" },
    4: { name: "Advanced", description: "Strong competence with ability to coach others" },
    5: { name: "Expert", description: "Exceptional competence and recognized expertise" }
  },

  developmentLevels: {
    minimal: { name: "Minimal", description: "Ready for role with minor development" },
    moderate: { name: "Moderate", description: "Some targeted development needed" },
    extensive: { name: "Extensive", description: "Significant development required" }
  }
}

class LeadsService {
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100))
  }

  async getFramework() {
    await this.delay()
    return { ...leadsFramework }
  }

  async getDomains() {
    await this.delay()
    return Object.entries(leadsFramework.domains).map(([id, domain]) => ({
      id,
      ...domain
    }))
  }

  async getDomain(domainId) {
    await this.delay()
    const domain = leadsFramework.domains[domainId]
    if (!domain) {
      throw new Error("Domain not found")
    }
    return { id: domainId, ...domain }
  }

  async getScoringLevels() {
    await this.delay()
    return { ...leadsFramework.scoringLevels }
  }

  async calculateReadinessRating(scores) {
    await this.delay()
    
    const domainScores = Object.values(scores)
      .map(domain => parseInt(domain.behavioralLevel) || 0)
      .filter(score => score > 0)

    if (domainScores.length === 0) {
      return {
        totalScore: 0,
        averageScore: 0,
        readinessRating: "Not Assessed",
        timeToReadiness: "",
        developmentPathway: ""
      }
    }

    const totalScore = domainScores.reduce((sum, score) => sum + score, 0)
    const averageScore = totalScore / domainScores.length

    let readinessRating = ""
    let timeToReadiness = ""
    let developmentPathway = ""

    if (averageScore >= 4.0) {
      readinessRating = "Ready"
      timeToReadiness = "<1 year"
      developmentPathway = "Minimal"
    } else if (averageScore >= 3.0) {
      readinessRating = "Developing"
      timeToReadiness = "1-2 years"
      developmentPathway = "Moderate"
    } else {
      readinessRating = "Not Ready"
      timeToReadiness = "2-3 years"
      developmentPathway = "Extensive"
    }

    return {
      totalScore,
      averageScore,
      readinessRating,
      timeToReadiness,
      developmentPathway
    }
  }

  async generateDevelopmentRecommendations(scores) {
    await this.delay()
    
    const recommendations = []
    
    Object.entries(scores).forEach(([domainId, score]) => {
      const domain = leadsFramework.domains[domainId]
      const behavioralLevel = parseInt(score.behavioralLevel) || 0
      
      if (behavioralLevel > 0 && behavioralLevel < 4) {
        let recommendation = ""
        
        switch (domainId) {
          case "leadSelf":
            if (behavioralLevel < 3) {
              recommendation = "Engage in executive coaching focused on self-awareness and emotional intelligence. Consider 360-degree feedback assessment."
            } else {
              recommendation = "Continue leadership development through advanced executive programs and peer coaching."
            }
            break
          case "engageOthers":
            if (behavioralLevel < 3) {
              recommendation = "Develop communication and influence skills through targeted training and practice opportunities."
            } else {
              recommendation = "Expand influence through cross-functional leadership roles and stakeholder engagement."
            }
            break
          case "achieveResults":
            if (behavioralLevel < 3) {
              recommendation = "Focus on goal-setting, accountability, and performance management training."
            } else {
              recommendation = "Take on larger scope responsibilities with P&L accountability."
            }
            break
          case "developCoalitions":
            if (behavioralLevel < 3) {
              recommendation = "Gain experience in stakeholder management and partnership development."
            } else {
              recommendation = "Lead external-facing initiatives and represent organization in industry forums."
            }
            break
          case "systemsTransformation":
            if (behavioralLevel < 3) {
              recommendation = "Participate in change management training and lead smaller transformation initiatives."
            } else {
              recommendation = "Lead enterprise-wide transformation efforts and develop systems thinking capabilities."
            }
            break
        }
        
        if (recommendation) {
          recommendations.push({
            domain: domain.name,
            currentLevel: behavioralLevel,
            recommendation
          })
        }
      }
    })
    
    return recommendations
  }
}

export const leadsService = new LeadsService()