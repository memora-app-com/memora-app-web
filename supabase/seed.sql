INSERT INTO plans
(id, "name", price, billing_type, "description", is_enabled, stripe_reference) 
VALUES 
('1', 'Free Trial', '0', 'free_trial', 'For users who just want to try out the application', 'true', ''), 
('2', 'One event (photos only)', '49', 'one_time', 'For users who have an upcoming event and want to gather long lasting memories', 'true', 'price_1PoT5B0282FgAIVoWvAbXzFS'),
('3', 'Event planners', '129', 'monthly', 'Suitable for event planners that organize events regurarily', 'true', 'price_1PoT6o0282FgAIVo0fiIi8vf');
