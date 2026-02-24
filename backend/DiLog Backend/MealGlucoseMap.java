@Entity
@Table(name = "meal_glucose_map")
@Data
public class MealGlucoseMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "meal_id")
    private Meal meal;

    @ManyToOne
    @JoinColumn(name = "glucose_range_id")
    private GlucoseRange glucoseRange;

    private Integer priority;
}

