local hf = require("help_functions")

-- The button table prototypes a clickable button such as the smiley buttons.
-- A button has a height, width and coordinates. A button can be clicked.
Button = {
    x,
    y,
    width = 60,
    height = 60,
    text
}

function Button:new(x, y)
    obj = {
        x = x,
        y = y
    }
    setmetatable(obj, self)
    self.__index = self
    return obj
end

function Button:is_pressed()
    if not love.mouse.isDown(1) then return false end
    local x, y = love.mouse.getPosition()
    return hf.is_clicked(self, x, y)
end

function Button:draw(color)
    love.graphics.setColor(color)
    love.graphics.rectangle("fill", self.x, self.y, self.width, self.height)
    love.graphics.setColor(0,0,0)
    love.graphics.rectangle("line", self.x, self.y, self.width, self.height)
    love.graphics.print(self.text, self.x + 5, self.y + self.height / 2)
end
