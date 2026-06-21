package main

import (
	"log"
	"os"

	"backend/db"
	"backend/handlers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Initialize Database
	db.InitDB()

	// 2. Set up Fiber app
	app := fiber.New(fiber.Config{
		AppName: "TalentaKu Expert System API v1.0",
	})

	// 3. Middlewares
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // Adjust for production if needed
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// 4. Register Routes
	api := app.Group("/api")

	// Public Routes
	api.Post("/admin/login", handlers.AdminLogin)
	api.Post("/register", handlers.UserRegister)
	api.Post("/login", handlers.UserLogin)
	api.Post("/login/google", handlers.UserGoogleLogin)
	api.Post("/consultations/claim", handlers.ClaimConsultation)
	api.Get("/variables", handlers.GetVariables)
	api.Post("/intake", handlers.StartIntake)
	api.Get("/consultations", handlers.GetHistory)
	api.Get("/consultation/:id", handlers.GetConsultation)
	api.Get("/consultation/:id/questions", handlers.GetConsultationQuestions)
	api.Post("/consultation/:id/submit", handlers.SubmitAnswers)
	api.Get("/consultation/:id/results", handlers.GetResults)

	// Admin Config & Simulation (Protected)
	adminGroup := api.Group("/admin", handlers.AuthRequired)
	adminGroup.Get("/stats", handlers.GetAdminStats)
	adminGroup.Get("/rules", handlers.GetRules)
	adminGroup.Post("/rules/simulate", handlers.SimulateInference)
	adminGroup.Get("/settings", handlers.GetSettings)
	adminGroup.Post("/settings", handlers.UpdateSettings)

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting TalentaKu backend server on port %s...", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}
