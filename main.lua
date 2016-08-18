-- Author: Rosco Kalis
--
-- Soundboard/main.lua
--
-- - This file contains the main game loop
-- - It calls to the lua state files depending on which state the game is in

local hf = require("help_functions")
require("button")

-- The love.load function is called at the start of the game
-- It seeds and initializes random.
-- It sets the game state.
function love.load()
    math.randomseed(os.time())
    math.random(); math.random(); math.random(); math.random()

    love.graphics.setBackgroundColor(100, 100, 100)

    buttons = {Button:new(200, 200)}

end

-- The love.update function is used for game logic
function love.update(dt)
    for _, button in ipairs(buttons) do
        if button:is_pressed() then
            button.text = "pressed"
        else
            button.text = "unpressed"
        end
    end
end

-- The love.draw function is used for displaying all objects to the screen
function love.draw()
    for _, button in ipairs(buttons) do
        button:draw({200,100,100})
    end
end

-- The love.keypressed function is called whenever a key is pressed
function love.keypressed(key)
end

-- The love.keyreleased function is called whenever a key is released
function love.keyreleased(key)
end

-- The love.mousereleased function is called whenever a mouse button is
-- released
function love.mousereleased(x, y, button)
end
