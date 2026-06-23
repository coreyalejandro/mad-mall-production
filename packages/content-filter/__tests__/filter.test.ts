/**
 * Non-Clinical Boundary Filter Tests
 * 
 * Tests for TLC Constraint #1 enforcement
 */

import { describe, it, expect } from 'vitest'
import { filterContent, isContentSafe, getViolations, getSuggestions } from '../index'

describe('Non-Clinical Boundary Filter', () => {
  describe('Medical Advice Detection', () => {
    it('should block direct medical advice', () => {
      const content = 'You should take 50mg of methimazole daily'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(false)
      expect(result.severity).toBe('block')
      expect(result.flags.length).toBeGreaterThan(0)
    })
    
    it('should block treatment claims', () => {
      const content = 'This will cure your Graves disease'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(false)
      expect(result.severity).toBe('block')
    })
    
    it('should block diagnosis language', () => {
      const content = 'You definitely have hyperthyroidism'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(false)
      expect(result.severity).toBe('block')
    })
    
    it('should block instructions to stop medication', () => {
      const content = 'You should stop taking your medication and try this natural remedy'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(false)
      expect(result.severity).toBe('block')
      expect(result.flags.length).toBeGreaterThan(0)
    })
  })
  
  describe('Personal Experience Sharing (Allowed)', () => {
    it('should allow personal experience', () => {
      const content = 'I tried methimazole and it worked for me'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
      expect(result.severity).toBe('none')
    })
    
    it('should allow sharing what doctor said', () => {
      const content = 'My doctor recommended I try a lower dose'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
    
    it('should allow information sharing', () => {
      const content = 'Research shows that early diagnosis improves outcomes'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
  })
  
  describe('Healthcare Routing (Allowed)', () => {
    it('should allow routing to healthcare providers', () => {
      const content = 'You should talk to your doctor about this'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
    
    it('should allow suggesting medical consultation', () => {
      const content = 'I recommend consulting an endocrinologist'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
  })
  
  describe('Disclaimers (Allowed)', () => {
    it('should allow content with disclaimers', () => {
      const content = 'This is not medical advice. I tried X and it helped me. Talk to your doctor.'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const result = filterContent('')
      
      expect(result.allowed).toBe(true)
      expect(result.severity).toBe('none')
      expect(result.flags).toHaveLength(0)
    })
    
    it('should handle content with multiple violations', () => {
      const content = 'You should take this medication. This will cure you. You definitely have Graves.'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(false)
      expect(result.flags.length).toBeGreaterThan(2)
    })
    
    it('should provide suggestions for violations', () => {
      const content = 'You should take 10mg daily'
      const result = filterContent(content)
      
      expect(result.suggestions).toBeDefined()
      expect(result.suggestions!.length).toBeGreaterThan(0)
    })
  })
  
  describe('Strict Mode', () => {
    it('should block warnings in strict mode', () => {
      const content = 'That\'s definitely a thyroid issue'
      const normalResult = filterContent(content)
      const strictResult = filterContent(content, { strictMode: true })
      
      expect(normalResult.severity).toBe('warning')
      expect(strictResult.severity).toBe('block')
      expect(strictResult.allowed).toBe(false)
    })
  })
  
  describe('Helper Functions', () => {
    it('isContentSafe should return boolean', () => {
      expect(isContentSafe('I tried this and it worked')).toBe(true)
      expect(isContentSafe('You should take this medication')).toBe(false)
    })
    
    it('getViolations should return array of flags', () => {
      const violations = getViolations('You should take 10mg daily')
      expect(Array.isArray(violations)).toBe(true)
      expect(violations.length).toBeGreaterThan(0)
    })
    
    it('getSuggestions should return helpful suggestions', () => {
      const suggestions = getSuggestions('You should take this')
      expect(Array.isArray(suggestions)).toBe(true)
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions[0]).toContain('personal experience')
    })
  })
  
  describe('Confidence Scoring', () => {
    it('should have high confidence for clear violations', () => {
      const content = 'You must take 50mg of methimazole'
      const result = filterContent(content)
      
      expect(result.confidence).toBeGreaterThan(0.8)
    })
    
    it('should have lower confidence for ambiguous content', () => {
      const content = 'That might be something'
      const result = filterContent(content)
      
      expect(result.confidence).toBeLessThan(0.7)
    })
  })
  
  describe('Real-World Examples', () => {
    it('should allow supportive community messages', () => {
      const content = 'I understand what you\'re going through. I found that keeping a symptom journal helped me communicate better with my doctor. Sending you strength! 💙'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
    
    it('should block well-intentioned but problematic advice', () => {
      const content = 'You should definitely stop taking that medication, it\'s poison. Try this natural supplement instead, it cured me!'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(false)
      expect(result.flags.length).toBeGreaterThan(1)
    })
    
    it('should allow sharing resources', () => {
      const content = 'I found this article helpful: [link]. It explains the different treatment options. Of course, talk to your doctor about what\'s right for you.'
      const result = filterContent(content)
      
      expect(result.allowed).toBe(true)
    })
  })
})

// Made with Bob
