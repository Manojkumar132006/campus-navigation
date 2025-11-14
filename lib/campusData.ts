import { CampusGraphData } from '@/types/campus';

export const campusData: CampusGraphData = {
  nodes: {
    "Block P": {
      name: "Block P",
      type: "academic",
      emoji: "🏢",
      x: 300,
      y: 80,
      description: "Block P",
      floors: 4
    },
    "Block D": {
      name: "Block D",
      type: "academic",
      emoji: "🏢",
      x: 150,
      y: 80,
      description: "Block D",
      floors: 5
    },
    "JSK Greens": {
      name: "JSK Greens",
      type: "recreational",
      emoji: "🌳",
      x: 300,
      y: 200,
      description: "JSK Greens - Central green space",
      floors: 0
    },
    "Block E": {
      name: "Block E",
      type: "academic",
      emoji: "🏢",
      x: 200,
      y: 320,
      description: "Block E (moved to left side)",
      floors: 5
    },
    "Block A": {
      name: "Block A",
      type: "academic",
      emoji: "🏢",
      x: 450,
      y: 320,
      description: "Block A (right side)",
      floors: 4
    },
    "Block B": {
      name: "Block B",
      type: "academic",
      emoji: "🏢",
      x: 450,
      y: 420,
      description: "Block B (right side)",
      floors: 4
    },
    "Block C": {
      name: "Block C",
      type: "academic",
      emoji: "🏢",
      x: 450,
      y: 520,
      description: "Block C (right side)",
      floors: 3
    },
    "Annapurna Canteen": {
      name: "Annapurna Canteen",
      type: "canteen",
      emoji: "🍽️",
      x: 450,
      y: 620,
      description: "Annapurna Canteen (right side)",
      floors: 0
    },
    "SAC Stage": {
      name: "SAC Stage",
      type: "recreational",
      emoji: "🎪",
      x: 450,
      y: 720,
      description: "SAC Stage (right side)",
      floors: 0
    },
    "Scinti Stage": {
      name: "Scinti Stage",
      type: "recreational",
      emoji: "🎤",
      x: 450,
      y: 820,
      description: "Scinti Stage (right side)",
      floors: 0
    },
    "Coca-Cola Canteen": {
      name: "Coca-Cola Canteen",
      type: "canteen",
      emoji: "🥤",
      x: 350,
      y: 820,
      description: "Coca-Cola Canteen (left of Scinti Stage)",
      floors: 0
    },
    "Ground": {
      name: "Ground",
      type: "recreational",
      emoji: "🏟️",
      x: 450,
      y: 1000,
      description: "Ground (right side)",
      floors: 0
    },
    "PEB Block": {
      name: "PEB Block",
      type: "facility",
      emoji: "🏗️",
      x: 450,
      y: 1080,
      description: "PEB Block (right side)",
      floors: 0
    }
  },
  edges: [
    ["Block A", "Block B"],
    ["Block B", "Block C"],
    ["Block D", "JSK Greens"],
    ["Block D", "Block E"],
    ["Block P", "JSK Greens"],
    ["JSK Greens", "Block A"],
    ["Block C", "Annapurna Canteen"],
    ["Annapurna Canteen", "SAC Stage"],
    ["SAC Stage", "Scinti Stage"],
    ["Scinti Stage", "Ground"],
    ["Scinti Stage", "Coca-Cola Canteen"],
    ["Ground", "PEB Block"],
    ["Block E", "Block A"],
    ["Block E", "Block B"],
    ["Block E", "Block C"],
    ["Block E", "Annapurna Canteen"],
    ["Block E", "Coca-Cola Canteen"]
  ]
};

export const mapSettings = {
  viewBoxWidth: 600,
  viewBoxHeight: 1100
};
